<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Organization extends Model
{
    //
    protected $fillable = [
        'name',
        'domain',
    ];

    public function passwords()
    {
        return $this->hasMany(Password::class);
    }
}
