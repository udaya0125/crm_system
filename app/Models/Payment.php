<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    //
    protected $fillable = [
        'customer_name',
        'amount',
        'service_type',
        'payment_reference',
        'paymentmode',
        'invoice_reference',
        'receiveddate',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }
}
