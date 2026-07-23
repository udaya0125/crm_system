<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'contact',
        'image',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // // A user has many task lists
    // public function taskLists()
    // {
    //     return $this->hasMany(TaskList::class);
    // }

    // // (Optional) A user has many tasks through task lists
    // public function tasks()
    // {
    //     return $this->hasManyThrough(Task::class, TaskList::class);
    // }

    // public function assignedTasks()
    // {
    //     return $this->hasMany(TaskList::class, 'assigned_to');
    // }

    // public function createdTasks()
    // {
    //     return $this->hasMany(TaskList::class, 'user_id');
    // }

    public function isAdmin()
    {
        return $this->role === 'admin';
    }

    public function isUser()
    {
        return $this->role === 'user';
    }

    public function todos()
    {
        return $this->hasMany(Todo::class);
    }

    // public function companies()
    // {
    //     return $this->hasMany(Company::class);
    // }

    public function projects()
    {
        return $this->hasMany(ProjectManagement::class, 'assigned_team');
    }

    public function tickets()
    {
        return $this->hasMany(Ticket::class, 'assigned_technician');
    }

    // public function assignedTasks()
    // {
    //     return $this->hasMany(TaskAssigned::class, 'assigned_id');
    // }
    // App\Models\User

public function assignedTasks()
{
    return $this->hasMany(TaskAssigned::class, 'assigned_team');
}


}
