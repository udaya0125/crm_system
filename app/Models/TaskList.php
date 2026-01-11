<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TaskList extends Model
{
    protected $fillable = [
        'title',
        'description',
        'user_id',
        'assigned_to'
    ];

    // Creator of the task list (usually admin)
    public function creator()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // User assigned to the task list
    public function assignedUser()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    // Tasks in this task list
    public function tasks()
    {
        return $this->hasMany(Task::class);
    }

    // Alias for creator (for backward compatibility)
    public function user()
    {
        return $this->creator();
    }




    // public function user()
    // {
    //     return $this->belongsTo(User::class, 'user_id'); // Creator
    // }
    
    // public function assignedUser()
    // {
    //     return $this->belongsTo(User::class, 'assigned_user_id'); // Assigned user
    // }
    
    // public function tasks()
    // {
    //     return $this->hasMany(Task::class);
    // }

}