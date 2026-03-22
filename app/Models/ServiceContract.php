<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServiceContract extends Model
{
    //
    protected $fillable = [
        'customer_name',
        'service_type',
        'grand_total',
        'duration_unit',
        'duration_value',
        'expiry_date',
        'invoice_number',
        'invoice_date',
        'service_names',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }
}
