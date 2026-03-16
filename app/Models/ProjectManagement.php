<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProjectManagement extends Model
{
       protected $table = 'project_management'; // Make sure this matches your table name
    
    protected $fillable = [
        'project_id',
        'client_name',
        'project_title',
        'service_type',
        'start_date',
        'deadline',
        'assigned_team',
        'priority',
        'status',
        'completion'
    ];

    protected static function boot()
    {
        parent::boot();

        static::created(function ($project) {
            $project->project_id = 'PRJ-' . str_pad($project->id, 3, '0', STR_PAD_LEFT);
            $project->save();
        });
    }

    public function descriptions()
    {
        return $this->hasMany(ProjectDescription::class, 'project_management_id');
    }

    // Helper method to get tasks as array
    public function getTasksAttribute()
    {
        return $this->descriptions()
            ->orderBy('sort')
            ->get()
            ->map(function($desc) {
                return [
                    'id' => $desc->id,
                    'text' => $desc->description,
                    'completed' => $desc->completed ?? false,
                    'sort' => $desc->sort
                ];
            })
            ->toArray();
    }
}