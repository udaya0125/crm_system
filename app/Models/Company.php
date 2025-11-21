<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class Company extends Model
{
    //
    protected $fillable = [
        'company_name','first_name','last_name','client_member', 'designation','no_of_rooms','phone_no','email','address','website','source','responsible_person','preffered_message','message_contact','comment','status','slug'
    ];

    public function contracts() {
    return $this->hasMany(CompanyContract::class);
}

public function initialResponses() {
    return $this->hasMany(CompanyInitialResponse::class);
}

public function followUpResponses() {
    return $this->hasMany(CompanyFollowUpResponse::class);
}

public function meetings() {
    return $this->hasMany(CompanyMeeting::class);
}

}
