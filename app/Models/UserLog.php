<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserLog extends Model
{
    //
    protected $fillable = [        
        'name',
        'ip_address',
        'title',
    ];
}
