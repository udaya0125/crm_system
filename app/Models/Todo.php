<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Todo extends Model
{
    //
    protected $fillable = [
        'user_id',
        'title',
        'is_completed',
        'due_date',
    ];

    public function descriptions()
    {
        return $this->hasMany(TodoDescription::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
