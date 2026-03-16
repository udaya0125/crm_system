<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    //
    protected $fillable = [
        'organization_name',
        'contact_person',
        'contact_phone',
        'email',
    ];

    public function expirations()
    {
        return $this->hasMany(Expiration::class);
    }

    public function domainManagements()
    {
        return $this->hasMany(DomainManagement::class);
    }
}
