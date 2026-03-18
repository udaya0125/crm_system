<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClientManagement extends Model
{
    //
    protected $fillable = [
        'lead_id',
        'company_name',
        'contact_person',
        'email',
        'phone',
        'address',
        'service_type',
        'account_manager',
        'total_projects',
        'total_revenue',
        'payment_status',
    ];

    
    // Define relationship to Lead
    public function lead()
    {
        return $this->belongsTo(Lead::class, 'lead_id');
    }
}
