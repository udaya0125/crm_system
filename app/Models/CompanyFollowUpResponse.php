<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompanyFollowUpResponse extends Model
{
    //
    protected $fillable = ['follow_up_response', 'company_id', 'meeting_outcome', 'follow_up_notes', 'follow_up_reason'];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }
}
