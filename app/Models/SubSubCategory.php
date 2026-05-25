<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SubSubCategory extends Model
{
    //

    protected $fillable = [
        'name',
        'sub_category_id',
    ];
    public function subCategory()
    {
        return $this->belongsTo(SubCategory::class);
    }
    public function passwords()
    {
        return $this->hasMany(Password::class);
    }
}
