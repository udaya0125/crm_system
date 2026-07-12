<?php

namespace App\Mail;

use App\Models\TaskAssigned;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class TaskReviewedMail extends Mailable
{
    use Queueable, SerializesModels;

    public TaskAssigned $task;

    public function __construct(TaskAssigned $task)
    {
        $this->task = $task;
    }

    public function build()
    {
        $isReopened = $this->task->admin_status === 'Reopened';

        return $this->subject(
                $isReopened
                    ? 'Task Reopened: ' . $this->task->title
                    : 'Task Approved: ' . $this->task->title
            )
            ->view('emails.task-reviewed')
            ->with([
                'task' => $this->task,
                'isReopened' => $isReopened,
            ]);
    }
}