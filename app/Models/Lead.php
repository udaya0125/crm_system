<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lead extends Model
{
    //
    protected $fillable = [
        'lead_id',
        'client_name',
        'company_name',
        'phone',
        'email',
        'service_interested',
        'lead_source',
        'assigned_salesperson',
        'next_followup_date',
        'notes',
        'status'
    ];
    
}
