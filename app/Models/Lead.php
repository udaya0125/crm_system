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


    protected static function boot()
    {
        parent::boot();

        static::created(function ($project) {
            $project->lead_id = 'LEAD-'.str_pad($project->id, 3, '0', STR_PAD_LEFT);
            $project->save();
        });
    }

}
