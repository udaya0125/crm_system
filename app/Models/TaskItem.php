<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TaskItem extends Model
{
    //
    protected $fillable = [
        'task_assigned_id',
        'description',
        'status',
        'sort_order',
        'completed_at',
    ];

    protected $casts = [
        'completed_at' => 'datetime',
    ];

    public function taskAssigned()
    {
        return $this->belongsTo(TaskAssigned::class, 'task_assigned_id');
    }
}
