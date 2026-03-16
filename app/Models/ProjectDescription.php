<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProjectDescription extends Model
{
    //
    protected $fillable = [
        'project_management_id',
        'description',
        'completed',
        'sort'
    ];

    protected $casts = [
        'completed' => 'boolean',
    ];

    public function project()
    {
        return $this->belongsTo(ProjectManagement::class, 'project_management_id');
    }
    
}
