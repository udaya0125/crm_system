<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $fillable = [
        'title',
        'is_completed',
        'due_date',
        'due_time',
        'task_list_id'
    ];

    // A task belongs to a task list
    public function taskList()
    {
        return $this->belongsTo(TaskList::class);
    }

    // A task has many descriptions
    public function descriptions()
    {
        return $this->hasMany(Description::class);
    }
}