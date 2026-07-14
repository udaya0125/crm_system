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
     * Update a task's core fields, append attachments, replace checklist
     * items, and notify reviewers if this update transitions the task into
     * Completed. admin_remarks/admin_status are never touched here — they
     * are exclusively owned by review().
     */
    public function update(TaskAssigned $task, array $data, ?array $attachments, ?array $taskItems): TaskAssigned
    {
        return DB::transaction(function () use ($task, $data, $attachments, $taskItems) {
            $wasCompletedBefore = $task->status === 'Completed';

            $assignedUser = User::findOrFail($data['assigned_team']);

            $task->update([
                'title' => $data['title'],
                'department' => $assignedUser->role, // re-derived in case assignee changed
                'assigned_team' => $assignedUser->id,
                'user_id' => $data['user_id'],
                'priority' => $data['priority'],
                'start_date' => $data['start_date'],
                'due_date' => $data['due_date'],
                'description' => $data['description'] ?? null,
                'status' => $data['status'] ?? $task->status,
            ]);

            $this->storeAttachments($task, $attachments);

            if (! empty($taskItems)) {
                $task->taskItems()->delete();
                $this->storeTaskItems($task, $taskItems);
            }

            $task->load('attachments', 'taskItems', 'assignedUser', 'creator');

            if (! $wasCompletedBefore && $task->status === 'Completed') {
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

    private function storeTaskItems(TaskAssigned $task, ?array $items): void
    {
        if (empty($items)) {
            return;
        }

        foreach ($items as $index => $item) {
            $task->taskItems()->create([
                'description' => $item['description'],
                'status' => $item['status'] ?? 'Pending',
                'sort_order' => $index + 1,
            ]);
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
}
