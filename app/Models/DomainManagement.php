<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DomainManagement extends Model
{
    //
    protected $fillable = [
        'domain_name',
        'client_id',
        'register',
        'purchase_date',
        'expiry_date',
        'auto_renewal_status',
        'dns_provider',
    ];

     public function client()
    {
        return $this->belongsTo(Client::class);
    }
}
