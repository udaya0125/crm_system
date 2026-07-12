<?php

namespace App\Mail;

use App\Models\TaskAssigned;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class TaskNotificationMail extends Mailable
{
    use Queueable, SerializesModels;

    public TaskAssigned $task;
    public string $type; // 'assigned' | 'created' | 'completed' | 'reviewed'
    public bool $isReopened;

    /**
     * @param TaskAssigned $task
     * @param string $type 'assigned' | 'created' | 'completed' | 'reviewed'
     */
    public function __construct(TaskAssigned $task, string $type)
    {
        $this->task = $task;
        $this->type = $type;
        $this->isReopened = $task->admin_status === 'Reopened';
    }

    public function build()
    {
        return $this->subject($this->resolveSubject())
            ->view('emails.task-notification')
            ->with([
                'task' => $this->task,
                'type' => $this->type,
                'isReopened' => $this->isReopened,
            ]);
    }

    private function resolveSubject(): string
    {
        return match ($this->type) {
            'assigned' => 'New Task Assigned: ' . $this->task->title,
            'created' => 'New Task Created: ' . $this->task->title,
            'completed' => 'Task Marked Completed: ' . $this->task->title,
            'reviewed' => $this->isReopened
                ? 'Task Reopened: ' . $this->task->title
                : 'Task Approved: ' . $this->task->title,
            default => 'Task Notification: ' . $this->task->title,
        };
    }
}