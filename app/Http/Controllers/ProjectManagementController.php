<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ProjectManagement;
use App\Models\ProjectDescription;
use App\Models\UserLog;

class ProjectManagementController extends Controller
{
    /**
     * Display all projects
     */
    public function index()
    {
        $projects = ProjectManagement::with(['descriptions', 'assignedUser'])->latest()->get();
        
        $transformedProjects = $projects->map(function($project) {
            $projectArray = $project->toArray();
            
            $tasks = $project->descriptions->map(function($desc) {
                return [
                    'id'        => $desc->id,
                    'text'      => $desc->description,
                    'completed' => (bool) $desc->completed,
                ];
            })->toArray();
            
            $projectArray['project_description']  = json_encode($tasks);
            $projectArray['assigned_team_name']   = $project->assignedUser?->name ?? '—';
            
            return $projectArray;
        });

        return response()->json([
            'status' => true,
            'data'   => $transformedProjects
        ]);
    }

    /**
     * Store new project
     */
    public function store(Request $request)
    {
        $request->validate([
            'client_name'         => 'required|string|max:255',
            'project_title'       => 'required|string|max:255',
            'service_type'        => 'required|string|max:255',
            'start_date'          => 'required|date',
            'deadline'            => 'required|date',
            'assigned_team'       => 'nullable|string|max:255',
            'user_remarks'        => 'nullable|string|max:255',
            'admin_remarks'       => 'nullable|string|max:255',
            'priority'            => 'required|string',
            'status'              => 'required|string',
            'completion'          => 'nullable|integer|min:0|max:100',
            'project_description' => 'nullable|json'
        ]);

        $project = ProjectManagement::create([
            'client_name'   => $request->client_name,
            'project_title' => $request->project_title,
            'service_type'  => $request->service_type,
            'start_date'    => $request->start_date,
            'deadline'      => $request->deadline,
            'assigned_team' => $request->assigned_team,
            'user_remarks'  => $request->user_remarks,
            'admin_remarks' => $request->admin_remarks,
            'priority'      => $request->priority,
            'status'        => $request->status,
            'completion'    => $request->completion ?? 0
        ]);

        if ($request->project_description) {
            $tasks = json_decode($request->project_description, true);
            
            if (is_array($tasks)) {
                foreach ($tasks as $index => $task) {
                    ProjectDescription::create([
                        'project_management_id' => $project->id,
                        'description'           => $task['text'] ?? '',
                        'completed'             => $task['completed'] ?? false,
                        'sort'                  => $index + 1
                    ]);
                }
            }
        }

        $project->load(['descriptions', 'assignedUser']);
        $projectData = $project->toArray();
        $projectData['assigned_team_name'] = $project->assignedUser?->name ?? '—';

        UserLog::create([
            'name'       => $request->user()?->name ?? 'System',
            'ip_address' => $request->ip(),
            'title'      => "Created project: {$project->project_title} for {$project->client_name}",
        ]);

        return response()->json([
            'status'  => true,
            'message' => 'Project created successfully',
            'data'    => $projectData
        ]);
    }

    /**
     * Update project
     */
    public function update(Request $request, $id)
    {
        $project = ProjectManagement::findOrFail($id);

        $request->validate([
            'client_name'         => 'sometimes|string|max:255',
            'project_title'       => 'sometimes|string|max:255',
            'service_type'        => 'sometimes|string|max:255',
            'start_date'          => 'sometimes|date',
            'deadline'            => 'sometimes|date',
            'assigned_team'       => 'nullable|string|max:255',
            'user_remarks'        => 'nullable|string|max:255',
            'admin_remarks'       => 'nullable|string|max:255',
            'priority'            => 'sometimes|string',
            'status'              => 'sometimes|string',
            'completion'          => 'nullable|integer|min:0|max:100',
            'project_description' => 'nullable|json'
        ]);

        $updateData = [];
        $fields = [
            'client_name', 'project_title', 'service_type', 'start_date',
            'deadline', 'assigned_team', 'user_remarks', 'admin_remarks',
            'priority', 'status', 'completion'
        ];
        
        foreach ($fields as $field) {
            if ($request->has($field)) {
                $updateData[$field] = $request->$field;
            }
        }
        
        $project->update($updateData);

        if ($request->has('project_description')) {
            $project->descriptions()->delete();
            
            $tasks = json_decode($request->project_description, true);
            
            if (is_array($tasks)) {
                foreach ($tasks as $index => $task) {
                    ProjectDescription::create([
                        'project_management_id' => $project->id,
                        'description'           => $task['text'] ?? '',
                        'completed'             => $task['completed'] ?? false,
                        'sort'                  => $index + 1
                    ]);
                }
            }
        }

        $project->load(['descriptions', 'assignedUser']);
        $projectData = $project->toArray();
        $projectData['assigned_team_name'] = $project->assignedUser?->name ?? '—';

        UserLog::create([
            'name'       => $request->user()?->name ?? 'System',
            'ip_address' => $request->ip(),
            'title'      => "Updated project: {$project->project_title} for {$project->client_name}",
        ]);

        return response()->json([
            'status'  => true,
            'message' => 'Project updated successfully',
            'data'    => $projectData
        ]);
    }

    /**
     * Delete project
     */
    public function destroy(Request $request, $id)
    {
        $project = ProjectManagement::findOrFail($id);
        $projectTitle = $project->project_title;
        $clientName   = $project->client_name;

        $project->descriptions()->delete();
        $project->delete();

        UserLog::create([
            'name'       => $request->user()?->name ?? 'System',
            'ip_address' => $request->ip(),
            'title'      => "Deleted project: {$projectTitle} for {$clientName}",
        ]);

        return response()->json([
            'status'  => true,
            'message' => 'Project deleted successfully'
        ]);
    }
}