<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Password extends Model
{
    //
        protected $fillable = [
        'organization_id',
        'category_id',
        'sub_category_id',
        'sub_sub_category_id',
        'username',
        'password',
        'expirydate',
        'note',
        'image',
    ];

    public function organization()
    {
        return $this->belongsTo(Organization::class, 'organization_id');
    }

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function subcategory()
    {
        return $this->belongsTo(SubCategory::class, 'sub_category_id');
    }

    public function subsubcategory()
    {
        return $this->belongsTo(SubSubCategory::class, 'sub_sub_category_id');
    }
}
