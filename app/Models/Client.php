<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    //
    protected $fillable = [
        'type',
        'name',
        'branchname',
        'code',
        'pannumber',
        'country',
        'state',
        'city',
        'street',
        'telone',
        'teltwo',
        'mobile',
        'email',
        'website',
        'activestatus',
        'ledgername',
    ];

    public function expirations()
    {
        return $this->hasMany(Expiration::class);
    }

    public function domainManagements()
    {
        return $this->hasMany(DomainManagement::class);
    }

    public function hostingManagements()
    {
        return $this->hasMany(HostingManagement::class);
    }

     public function serviceContracts()
    {
        return $this->hasMany(ServiceContract::class);
    }
}
