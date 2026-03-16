<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HostingManagement extends Model
{
    //
    protected $fillable = [
        'hosting_plan',
        'client_id',
        'disk_usage',
        'renewal_date',
        'hosting_provider',
    ];

         public function client()
    {
        return $this->belongsTo(Client::class);
    }

}
