<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompanyInitialResponse extends Model
{
    //
    protected $fillable = [
        'initial_response','company_id','meeting_outcome','initial_notes','initial_reason'
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }
}
