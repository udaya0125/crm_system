<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TaskAttachment extends Model
{
    //
    protected $fillable = [
        'task_assigned_id',
        'attachment',
    ];

    public function task()
    {
        return $this->belongsTo(TaskAssigned::class, 'task_assigned_id');
    }
}
