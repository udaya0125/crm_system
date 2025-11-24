<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Company extends Model
{
    protected $fillable = [
        'company_name', 'first_name', 'last_name', 'client_member', 'designation', 
        'no_of_rooms', 'phone_no', 'email', 'address', 'website', 'source', 
        'responsible_person', 'preffered_message', 'message_contact', 'comment','follow_up_date', 
        'status', 'slug'
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

        static::creating(function ($company) {
            // Generate slug without saving first
            $company->slug = $company->generateUniqueSlug();
        });
    }

    protected function generateUniqueSlug()
    {
        $baseSlug = Str::slug($this->company_name);
        $slug = $baseSlug;
        $counter = 1;

        // Check if slug exists (excluding current model if updating)
        while (static::where('slug', $slug)->exists()) {
            $slug = $baseSlug . '-' . $counter;
            $counter++;
        }

        return $slug;
    }
}