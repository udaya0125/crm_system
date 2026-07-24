<?php

namespace App\Services;

use App\Mail\TaskNotificationMail;
use App\Models\TaskAssigned;
use App\Models\TaskAttachment;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;

class TaskAssignedService
{
    public const PRIVILEGED_ROLES = ['admin', 'manager'];

    public const ADMIN_STATUS_REOPENED = 'Reopened';

    public const ADMIN_STATUS_APPROVED = 'Completed';

    /**
     * Whether the given user can act on any task (not just their own).
     */
    public function isPrivileged(?User $user): bool
    {
        return $user && in_array($user->role, self::PRIVILEGED_ROLES);
    }

    /**
     * Whether the given user is involved in this task (assignee or assigner).
     */
    public function ownsTask(?User $user, TaskAssigned $task): bool
    {
        if (! $user) {
            return false;
        }

        return (int) $task->assigned_team === (int) $user->id
            || (int) $task->user_id === (int) $user->id;
    }

    /**
     * Paginated task listing, scoped to the user unless privileged.
     */
    public function paginatedFor(User $user, int $perPage = 15)
    {
        $query = TaskAssigned::with([
            'attachments',
            'taskItems',
            'assignedUser:id,name,role,email',
            'creator:id,name,role,email',
        ])->latest();

        if (! $this->isPrivileged($user)) {
            $query->where(function ($q) use ($user) {
                $q->where('assigned_team', $user->id)
                    ->orWhere('user_id', $user->id);
            });
        }

        return $query->paginate($perPage)->withQueryString();
    }

    /**
     * Every user (id, name, role), for the Task Report filter dropdown.
     * Deliberately NOT scoped to "has at least one task" like
     * usersWithTaskCounts() — the dropdown should let you pick any team
     * member, not just ones who already show up in the current results.
     */
    public function allTeamMembers(): Collection
    {
        return User::query()
            ->select('id', 'name', 'role')
            ->orderBy('name')
            ->get();
    }

  /**
 * Every user who has at least one task assigned to them, with counts
 * split by status — powers the Task Report user-card grid. Requires a
 * `assignedTasks` hasMany relation on the User model
 * (assigned_team -> TaskAssigned).
 *
 * Filters (all optional), mirroring the old task-row report filters:
 * - user_id: only include this specific user (from the Task Report's
 *   team-member dropdown)
 * - role: matches the user's role column
 * - status: only include users who have at least one task with this
 *   status (the task counts themselves still show the full breakdown —
 *   this only narrows which cards appear)
 * - start_date / end_date: bounds every count subquery to tasks whose
 *   own `start_date` falls in this range, same convention used
 *   elsewhere (reportSummary, departmentSummary)
 */
public function usersWithTaskCounts(array $filters = []): Collection
{
    $dateScope = function ($q) use ($filters) {
        if (! empty($filters['start_date'])) {
            $q->whereDate('start_date', '>=', $filters['start_date']);
        }
        if (! empty($filters['end_date'])) {
            $q->whereDate('start_date', '<=', $filters['end_date']);
        }
    };

    $query = User::query()
        ->select('id', 'name', 'role', 'email')
        ->withCount([
            'assignedTasks as total_tasks' => $dateScope,
            'assignedTasks as completed_tasks' => function ($q) use ($dateScope) {
                $dateScope($q);
                $q->where('status', 'Completed');
            },
            'assignedTasks as in_progress_tasks' => function ($q) use ($dateScope) {
                $dateScope($q);
                $q->where('status', 'In Progress');
            },
            'assignedTasks as pending_tasks' => function ($q) use ($dateScope) {
                $dateScope($q);
                $q->where('status', 'Pending');
            },
        ])
        ->having('total_tasks', '>', 0);

    if (! empty($filters['user_id'])) {
        $query->where('id', $filters['user_id']);
    }

    if (! empty($filters['role'])) {
        $query->where('role', $filters['role']);
    }

    $users = $query->orderByDesc('total_tasks')->get();

    if (! empty($filters['status'])) {
        $countColumn = match ($filters['status']) {
            'Completed' => 'completed_tasks',
            'In Progress' => 'in_progress_tasks',
            'Pending' => 'pending_tasks',
            default => null,
        };

        if ($countColumn) {
            $users = $users->filter(fn ($u) => $u->{$countColumn} > 0)->values();
        }
    }

    return $users;
}

    /**
     * Every task assigned to a given user — with checklist items,
     * assignee, and creator — used by the Task Report workload popup to
     * list "everything this person has done." The task's rich-text
     * `description` is still present on the model but the frontend never
     * renders it for this view.
     */
    public function tasksForUser(int $userId)
    {
        return TaskAssigned::with([
            'taskItems',
            'assignedUser:id,name,role,email',
            'creator:id,name,role,email',
        ])
            ->where('assigned_team', $userId)
            ->latest()
            ->get();
    }

    /**
     * Aggregate stats for a single assignee, shown in the Task Report
     * workload popup: how many tasks they've handled in total, their
     * current split by status, and their average completion time across
     * every Completed task — measured from start_date to due_date, since
     * due_date is what marks the completion point here (no separate
     * completed_at column).
     */
    public function userTaskStats(int $userId): array
    {
        $tasks = TaskAssigned::where('assigned_team', $userId)->get();

        $completed = $tasks->where('status', 'Completed');

        $completionSeconds = $completed
            ->filter(fn ($t) => $t->start_date && $t->due_date)
            ->map(fn ($t) => \Carbon\Carbon::parse($t->start_date)->diffInSeconds($t->due_date));

        return [
            'total_tasks' => $tasks->count(),
            'completed' => $completed->count(),
            'in_progress' => $tasks->where('status', 'In Progress')->count(),
            'pending' => $tasks->where('status', 'Pending')->count(),
            'avg_completion_seconds' => $completionSeconds->isNotEmpty()
                ? (int) round($completionSeconds->avg())
                : null,
        ];
    }

    /**
     * Create a task, its attachments, and its checklist items, then notify
     * the assignee AND all privileged reviewers (admin/manager) that a new
     * task was created. Runs in a transaction; email failures are logged
     * but never roll back the transaction or bubble up.
     */
    public function create(array $data, ?array $attachments, ?array $taskItems): TaskAssigned
    {
        return DB::transaction(function () use ($data, $attachments, $taskItems) {
            $assignedUser = User::findOrFail($data['assigned_team']);

            $task = TaskAssigned::create([
                'title' => $data['title'],
                'department' => $assignedUser->role, // snapshot of assignee's role at creation time
                'assigned_team' => $assignedUser->id,
                'user_id' => $data['user_id'],
                'priority' => $data['priority'],
                'start_date' => $data['start_date'],
                'due_date' => $data['due_date'],
                'description' => $data['description'] ?? null,
                'status' => 'Pending',
            ]);

            $this->storeAttachments($task, $attachments);
            $this->storeTaskItems($task, $taskItems);

            $task->load('attachments', 'taskItems', 'assignedUser', 'creator');

            $this->notify($assignedUser, $task, 'assigned', 'task assigned');
            $this->notifyReviewers($task, 'created', 'task created');

            return $task;
        });
    }

    /**
     * Update a task's core fields, append attachments, sync checklist
     * items (update existing / create new / delete removed), and notify
     * reviewers if this update transitions the task into Completed.
     * admin_remarks/admin_status are never touched here — they are
     * exclusively owned by review().
     */
    public function update(TaskAssigned $task, array $data, ?array $attachments, ?array $taskItems): TaskAssigned
    {
        return DB::transaction(function () use ($task, $data, $attachments, $taskItems) {
            $previousStatus = $task->status;
            $newStatus = $data['status'] ?? $task->status;

            $assignedUser = User::findOrFail($data['assigned_team']);

            $updateData = [
                'title' => $data['title'],
                'department' => $assignedUser->role,
                'assigned_team' => $assignedUser->id,
                'user_id' => $data['user_id'],
                'priority' => $data['priority'],
                'start_date' => $data['start_date'],
                'due_date' => $data['due_date'],
                'description' => $data['description'] ?? null,
                'status' => $newStatus,
            ];

            $task->update($updateData);

            $this->storeAttachments($task, $attachments);

            if (! empty($taskItems)) {
                $this->syncTaskItems($task, $taskItems);
            }

            $task->load('attachments', 'taskItems', 'assignedUser', 'creator');

            if ($previousStatus !== 'Completed' && $newStatus === 'Completed') {
                $this->notifyReviewers($task, 'completed', 'task completed');
            }

            return $task;
        });
    }

    /**
     * Apply an admin/manager's review verdict to a Completed task and
     * notify the assignee. Can loop indefinitely (Completed -> Reopened ->
     * In Progress -> re-edited -> Completed -> ...) until eventually
     * approved, at which point admin_status permanently locks it.
     */
    public function review(TaskAssigned $task, string $adminStatus, ?string $adminRemarks): TaskAssigned
    {
        if ($adminStatus === self::ADMIN_STATUS_REOPENED) {
            $task->update([
                'status' => 'In Progress',
                'admin_status' => self::ADMIN_STATUS_REOPENED,
                'admin_remarks' => $adminRemarks,
            ]);
        } else {
            $task->update([
                'admin_status' => self::ADMIN_STATUS_APPROVED,
                'admin_remarks' => $adminRemarks,
            ]);
        }

        $task->load('attachments', 'taskItems', 'assignedUser', 'creator');

        $this->notify($task->assignedUser, $task, 'reviewed', 'task reviewed');

        return $task;
    }

    /**
     * Delete a task, its attachments (files + records), and its checklist
     * items.
     */
    public function delete(TaskAssigned $task): void
    {
        DB::transaction(function () use ($task) {
            foreach ($task->attachments as $attachment) {
                $this->deleteAttachmentFile($attachment);
            }

            $task->attachments()->delete();
            $task->taskItems()->delete();
            $task->delete();
        });
    }

    /**
     * Remove a single attachment (file + record) from a task.
     */
    public function deleteAttachment(TaskAssigned $task, int $attachmentId): void
    {
        $attachment = TaskAttachment::where('task_assigned_id', $task->id)
            ->findOrFail($attachmentId);

        $this->deleteAttachmentFile($attachment);

        $attachment->delete();
    }

    /**
     * @param  UploadedFile[]|null  $files
     */
    private function storeAttachments(TaskAssigned $task, ?array $files): void
    {
        if (empty($files)) {
            return;
        }

        foreach ($files as $file) {
            $path = $file->store('task_attachments', 'public');

            $task->attachments()->create([
                'attachment' => $path,
            ]);
        }
    }

    /**
     * Reconcile the task's checklist items with the incoming payload:
     * - items with an existing 'id' are updated in place
     * - items without an 'id' (or with an id that doesn't belong to this
     *   task) are created fresh
     * - any existing item whose id is NOT present in the incoming payload
     *   is deleted (it was removed on the frontend)
     *
     * This preserves row IDs and created_at across edits, instead of
     * wiping and recreating every item on every update.
     *
     * @param  array<int, array{id?: int|string|null, description: string, status?: string|null}>  $items
     */
    private function syncTaskItems(TaskAssigned $task, array $items): void
    {
        $incomingIds = collect($items)
            ->pluck('id')
            ->filter() // drop null/empty ids (new items)
            ->map(fn ($id) => (int) $id)
            ->all();

        // Delete items that existed before but are no longer in the payload.
        // whereNotIn('id', [0]) when $incomingIds is empty means "delete all",
        // which is correct: an empty incoming id list means every item is new.
        $task->taskItems()
            ->whereNotIn('id', $incomingIds ?: [0])
            ->delete();

        $this->storeTaskItems($task, $items);
    }

    /**
     * Create or update each incoming task item.
     * - If the item has an 'id' belonging to this task, it's updated.
     * - Otherwise a new row is created.
     * sort_order always reflects the incoming array position.
     *
     * @param  array<int, array{id?: int|string|null, description: string, status?: string|null}>  $items
     */
    // private function storeTaskItems(TaskAssigned $task, ?array $items): void
    // {
    //     if (empty($items)) {
    //         return;
    //     }

    //     foreach ($items as $index => $item) {
    //         $id = $item['id'] ?? null;
    //         $status = $item['status'] ?? 'Pending';

    //         $attributes = [
    //             'description' => $item['description'],
    //             'status' => $status,
    //             'sort_order' => $index + 1,
    //         ];

    //         if ($id && $task->taskItems()->where('id', $id)->exists()) {
    //             $task->taskItems()->where('id', $id)->update($attributes);
    //         } else {
    //             $task->taskItems()->create($attributes);
    //         }
    //     }
    // }

   /**
     * Create or update each incoming task item.
     * - If the item has an 'id' belonging to this task AND is already
     *   marked Completed, it is PERMANENTLY locked — skipped entirely,
     *   regardless of what the incoming payload says. This mirrors the
     *   frontend, where a Completed checklist item can no longer be
     *   toggled back to Pending or have its description edited.
     * - Otherwise, if the item has an 'id' belonging to this task, it's
     *   updated — but ONLY if something actually changed. Since the
     *   frontend resends the full checklist on every save, running
     *   update() on every row unconditionally would bump updated_at on
     *   every sibling item just because one of them was edited. We
     *   compare first and skip the save entirely for untouched rows.
     * - A pure reorder (sort_order shifts but description/status don't)
     *   is persisted without touching updated_at, since that's not a
     *   content edit — only a real description/status change bumps it.
     * - Otherwise a new row is created.
     *
     * @param  array<int, array{id?: int|string|null, description: string, status?: string|null}>  $items
     */
    private function storeTaskItems(TaskAssigned $task, ?array $items): void
    {
        if (empty($items)) {
            return;
        }

        foreach ($items as $index => $item) {
            $id = $item['id'] ?? null;
            $status = $item['status'] ?? 'Pending';

            $attributes = [
                'description' => $item['description'],
                'status' => $status,
                'sort_order' => $index + 1,
            ];

            if ($id) {
                $existing = $task->taskItems()->find($id);

                if ($existing) {
                    // Permanently locked — once Completed, ignore any
                    // further change (status flip, description edit, or
                    // even a reorder) sent from the client.
                    if ($existing->status === 'Completed') {
                        continue;
                    }

                    $contentChanged = $existing->description !== $attributes['description']
                        || $existing->status !== $attributes['status'];

                    $existing->fill($attributes);

                    if ($existing->isDirty()) {
                        if (! $contentChanged) {
                            // Only the sort position moved — save it
                            // silently, don't touch updated_at.
                            $existing->timestamps = false;
                        }

                        $existing->save();
                    }

                    continue;
                }
            }

            $task->taskItems()->create($attributes);
        }
    }

    private function deleteAttachmentFile(TaskAttachment $attachment): void
    {
        if (Storage::disk('public')->exists($attachment->attachment)) {
            Storage::disk('public')->delete($attachment->attachment);
        }
    }

    /**
     * @return Collection<int, User>
     */
    private function reviewers(): Collection
    {
        return User::whereIn('role', self::PRIVILEGED_ROLES)->get();
    }

    /**
     * Notify every privileged (admin/manager) user about a task event —
     * used both when a new task is created and when one is marked
     * completed and needs review.
     */
    private function notifyReviewers(TaskAssigned $task, string $type, string $label): void
    {
        foreach ($this->reviewers() as $reviewer) {
            $this->notify($reviewer, $task, $type, $label);
        }
    }

    /**
     * Send a task notification email, logging (never throwing) on failure
     * so a broken mail server never rolls back a DB transaction or fails
     * the request.
     */
    private function notify(User $recipient, TaskAssigned $task, string $type, string $label): void
    {
        try {
            Mail::to($recipient->email)->send(new TaskNotificationMail($task, $type));
        } catch (\Exception $e) {
            Log::error("Failed to send {$label} email to {$recipient->email}: ".$e->getMessage());
        }
    }


    /**
 * Every filtered team member with their FULL task detail nested in —
 * every task (with checklist items + creator), not just counts. Used
 * exclusively by the "Export PDF" button on the Task Report page so the
 * export contains everything the model provides (assigned to/by, start/
 * due dates, every checklist item's description/status/completed_at),
 * not just what the card grid displays on screen.
 *
 * Filters (all optional), same semantics as usersWithTaskCounts():
 * - user_id: only include this specific user
 * - role: matches the user's role column
 * - status: only include tasks with this status (narrows the nested
 *   task list itself, not just which users appear)
 * - start_date / end_date: bounds on the task's own start_date column
 */
public function usersWithFullTasks(array $filters = []): Collection
{
    $taskScope = function ($q) use ($filters) {
        if (! empty($filters['start_date'])) {
            $q->whereDate('start_date', '>=', $filters['start_date']);
        }
        if (! empty($filters['end_date'])) {
            $q->whereDate('start_date', '<=', $filters['end_date']);
        }
        if (! empty($filters['status'])) {
            $q->where('status', $filters['status']);
        }
        $q->with(['taskItems', 'creator:id,name,role,email'])->latest();
    };

    $countScope = function ($q) use ($filters) {
        if (! empty($filters['start_date'])) {
            $q->whereDate('start_date', '>=', $filters['start_date']);
        }
        if (! empty($filters['end_date'])) {
            $q->whereDate('start_date', '<=', $filters['end_date']);
        }
    };

    $query = User::query()
        ->select('id', 'name', 'role', 'email')
        ->with(['assignedTasks' => $taskScope])
        ->withCount(['assignedTasks as total_tasks' => $countScope])
        ->having('total_tasks', '>', 0);

    if (! empty($filters['user_id'])) {
        $query->where('id', $filters['user_id']);
    }

    if (! empty($filters['role'])) {
        $query->where('role', $filters['role']);
    }

    $users = $query->orderByDesc('total_tasks')->get();

    // When a status filter is active, a user may have total_tasks > 0
    // overall but zero tasks matching that specific status once the
    // nested assignedTasks relation is scoped above — drop those.
    if (! empty($filters['status'])) {
        $users = $users->filter(fn ($u) => $u->assignedTasks->isNotEmpty())->values();
    }

    return $users;
}

}