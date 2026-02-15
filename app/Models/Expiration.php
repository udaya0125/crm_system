<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Expiration extends Model
{
    //
    protected $fillable = [
        'client_id',
        'title',
        'last_renewal_date',
        'duration',
        'expiration_date',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }
}
