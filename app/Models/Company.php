<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Company extends Model
{
 

    protected $fillable = [
        'company_name','full_name','designation','phone_no','email','address','responsible_person','our_team','client_member','comment','follow_up_date','slug'
    ];

    public function contracts()
    {
        return $this->hasOne(CompanyContract::class);
    }

    public function initialResponses()
    {
        return $this->hasOne(CompanyInitialResponse::class);
    }

    public function followUpResponses()
    {
        return $this->hasOne(CompanyFollowUpResponse::class);
    }

    public function meetings()
    {
        return $this->hasOne(CompanyMeeting::class);
    }

    protected static function boot()
    {
        parent::boot();

        // Generate slug when creating
        static::creating(function ($company) {
            $company->slug = $company->generateUniqueSlug($company->company_name);
        });

        // Update slug when company_name is changed
        static::updating(function ($company) {
            if ($company->isDirty('company_name')) {
                $company->slug = $company->generateUniqueSlug($company->company_name, $company->id);
            }
        });
    }

    protected function generateUniqueSlug($name, $ignoreId = null)
    {
        $baseSlug = Str::slug($name);
        $slug = $baseSlug;
        $counter = 1;

        // Check if slug exists (but ignore current record)
        while (
            static::where('slug', $slug)
                ->when($ignoreId, fn($q) => $q->where('id', '!=', $ignoreId))
                ->exists()
        ) {
            $slug = $baseSlug . '-' . $counter;
            $counter++;
        }

        return $slug;
    }
}
