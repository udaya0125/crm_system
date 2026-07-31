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

    public function isPrivileged(?User $user): bool
    {
        return $user && in_array($user->role, self::PRIVILEGED_ROLES);
    }

    public function ownsTask(?User $user, TaskAssigned $task): bool
    {
        if (! $user) {
            return false;
        }

        return (int) $task->assigned_team === (int) $user->id
            || (int) $task->user_id === (int) $user->id;
    }

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

    public function allTeamMembers(): Collection
    {
        return User::query()
            ->select('id', 'name', 'role')
            ->orderBy('name')
            ->get();
    }

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
     * every Completed task — measured from created_at to updated_at.
     *
     * created_at (not start_date) is used as the starting point because
     * start_date is a date-only field with no time-of-day (stored as
     * midnight), which would make every "completed same day" task show
     * a bogus multi-hour duration (time since midnight, not time actually
     * spent). created_at is a real timestamp — the moment the task row
     * was created — so pairing it with updated_at (the moment it was
     * saved as Completed) gives a duration that actually reflects elapsed
     * working time.
     */
    public function userTaskStats(int $userId): array
    {
        $tasks = TaskAssigned::where('assigned_team', $userId)->get();

        $completed = $tasks->where('status', 'Completed');

        $completionSeconds = $completed
            ->filter(fn ($t) => $t->created_at && $t->updated_at)
            ->map(fn ($t) => \Carbon\Carbon::parse($t->created_at)->diffInSeconds($t->updated_at));

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

    public function create(array $data, ?array $attachments, ?array $taskItems): TaskAssigned
    {
        return DB::transaction(function () use ($data, $attachments, $taskItems) {
            $assignedUser = User::findOrFail($data['assigned_team']);

            $task = TaskAssigned::create([
                'title' => $data['title'],
                'department' => $assignedUser->role,
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

    public function update(TaskAssigned $task, array $data, ?array $attachments, ?array $taskItems): TaskAssigned
    {
        return DB::transaction(function () use ($task, $data, $attachments, $taskItems) {
            $previousStatus = $task->status;

            if ($previousStatus === 'Completed') {
                if (! empty($taskItems)) {
                    $this->syncTaskItems($task, $taskItems);
                }

                $task->load('attachments', 'taskItems', 'assignedUser', 'creator');

                return $task;
            }

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

    private function syncTaskItems(TaskAssigned $task, array $items): void
    {
        $incomingIds = collect($items)
            ->pluck('id')
            ->filter()
            ->map(fn ($id) => (int) $id)
            ->all();

        $task->taskItems()
            ->whereNotIn('id', $incomingIds ?: [0])
            ->delete();

        $this->storeTaskItems($task, $items);
    }

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
                    if ($existing->status === 'Completed') {
                        continue;
                    }

                    $contentChanged = $existing->description !== $attributes['description']
                        || $existing->status !== $attributes['status'];

                    $existing->fill($attributes);

                    if ($existing->isDirty()) {
                        if (! $contentChanged) {
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

    private function notifyReviewers(TaskAssigned $task, string $type, string $label): void
    {
        foreach ($this->reviewers() as $reviewer) {
            $this->notify($reviewer, $task, $type, $label);
        }
    }

    private function notify(User $recipient, TaskAssigned $task, string $type, string $label): void
    {
        try {
            Mail::to($recipient->email)->send(new TaskNotificationMail($task, $type));
        } catch (\Exception $e) {
            Log::error("Failed to send {$label} email to {$recipient->email}: ".$e->getMessage());
        }
    }

    /**
     * Full nested task data for every user matching the given filters —
     * feeds the Task Report "Export PDF" flow.
     *
     * Filters (all optional):
     * - user_ids: array of user ids — takes priority over user_id. Used
     *   by the "Export a few" picker so the caller can export an
     *   arbitrary subset of team members in one request.
     * - user_id: a single user id — kept for backward compatibility with
     *   the page's top-bar "select a team member" filter and with the
     *   plain "Export all" flow (where it's simply absent).
     * - role, status, start_date, end_date: same as usersWithTaskCounts().
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

        // "Export a few" sends an explicit list of user ids — this always
        // wins over the single user_id filter when both are present.
        if (! empty($filters['user_ids'])) {
            $query->whereIn('id', (array) $filters['user_ids']);
        } elseif (! empty($filters['user_id'])) {
            $query->where('id', $filters['user_id']);
        }

        if (! empty($filters['role'])) {
            $query->where('role', $filters['role']);
        }

        $users = $query->orderByDesc('total_tasks')->get();

        if (! empty($filters['status'])) {
            $users = $users->filter(fn ($u) => $u->assignedTasks->isNotEmpty())->values();
        }

        return $users;
    }
}