<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TaskAssigned extends Model
{
    //
    protected $fillable = [
        'task_id',
        'title',
        'department',
        'assigned_team',
        'user_id',
        'priority',
        'start_date',
        'due_date',
        'description',
        'status',
        'admin_remarks',
        'admin_status',
    ];

    protected static function boot()
    {
        parent::boot();

        static::created(function ($task) {
            $task->task_id = 'TASK-'.str_pad($task->id, 3, '0', STR_PAD_LEFT);
            $task->save();
        });
    }

    public function attachments()
    {
        return $this->hasMany(TaskAttachment::class, 'task_assigned_id');
    }

    public function taskItems()
    {
        return $this->hasMany(TaskItem::class, 'task_assigned_id');
    }

    // The person the task is assigned TO (does the work)
    public function assignedUser()
    {
        return $this->belongsTo(User::class, 'assigned_team');
    }

    // The person who assigned/created the task
    public function creator()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
