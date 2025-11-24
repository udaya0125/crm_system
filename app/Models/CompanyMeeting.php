<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompanyMeeting extends Model
{
    //
    protected $fillable =[
        'meeting_date','meeting_time','meeting_type','meeting_platform','attendee','company_id','agenda','meeting_location'
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }
}
