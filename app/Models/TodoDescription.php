<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TodoDescription extends Model
{
    //
    protected $fillable = [
        'todo_id',
        'description',
    ];

    public function todo()
    {
        return $this->belongsTo(Todo::class);
    }
}
