<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompanyContract extends Model
{
    //
    protected $fillable = [
       'image','company_id'
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }
}
