<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ProjectManagement;
use App\Models\ProjectDescription;

class ProjectManagementController extends Controller
{
    /**
     * Display all projects
     */
    public function index()
    {
        $projects = ProjectManagement::with('descriptions')->latest()->get();
        
        // Transform the data to include tasks in the expected format
        $transformedProjects = $projects->map(function($project) {
            $projectArray = $project->toArray();
            
            // Format tasks from descriptions
            $tasks = $project->descriptions->map(function($desc) {
                return [
                    'id' => $desc->id,
                    'text' => $desc->description,
                    'completed' => (bool) $desc->completed,
                ];
            })->toArray();
            
            // Add tasks as project_description (JSON string)
            $projectArray['project_description'] = json_encode($tasks);
            
            return $projectArray;
        });

        return response()->json([
            'status' => true,
            'data' => $transformedProjects
        ]);
    }

    /**
     * Store new project
     */
    public function store(Request $request)
    {
        $request->validate([
            'client_name' => 'required|string|max:255',
            'project_title' => 'required|string|max:255',
            'service_type' => 'required|string|max:255',
            'start_date' => 'required|date',
            'deadline' => 'required|date',
            'assigned_team' => 'nullable|string|max:255',
            'priority' => 'required|string',
            'status' => 'required|string',
            'completion' => 'nullable|integer|min:0|max:100',
            'project_description' => 'nullable|json' // Accept JSON string
        ]);

        $project = ProjectManagement::create([
            'client_name' => $request->client_name,
            'project_title' => $request->project_title,
            'service_type' => $request->service_type,
            'start_date' => $request->start_date,
            'deadline' => $request->deadline,
            'assigned_team' => $request->assigned_team,
            'priority' => $request->priority,
            'status' => $request->status,
            'completion' => $request->completion ?? 0
        ]);

        // Save tasks from project_description
        if ($request->project_description) {
            $tasks = json_decode($request->project_description, true);
            
            if (is_array($tasks)) {
                foreach ($tasks as $index => $task) {
                    ProjectDescription::create([
                        'project_management_id' => $project->id,
                        'description' => $task['text'] ?? '',
                        'completed' => $task['completed'] ?? false,
                        'sort' => $index + 1
                    ]);
                }
            }
        }

        return response()->json([
            'status' => true,
            'message' => 'Project created successfully',
            'data' => $project->load('descriptions')
        ]);
    }

    /**
     * Update project
     */
    public function update(Request $request, $id)
    {
        $project = ProjectManagement::findOrFail($id);

        $request->validate([
            'client_name' => 'sometimes|string|max:255',
            'project_title' => 'sometimes|string|max:255',
            'service_type' => 'sometimes|string|max:255',
            'start_date' => 'sometimes|date',
            'deadline' => 'sometimes|date',
            'assigned_team' => 'nullable|string|max:255',
            'priority' => 'sometimes|string',
            'status' => 'sometimes|string',
            'completion' => 'nullable|integer|min:0|max:100',
            'project_description' => 'nullable|json'
        ]);

        // Update project fields
        $updateData = [];
        $fields = ['client_name', 'project_title', 'service_type', 'start_date', 
                  'deadline', 'assigned_team', 'priority', 'status', 'completion'];
        
        foreach ($fields as $field) {
            if ($request->has($field)) {
                $updateData[$field] = $request->$field;
            }
        }
        
        $project->update($updateData);

        // Update tasks from project_description
        if ($request->has('project_description')) {
            // Delete existing descriptions
            $project->descriptions()->delete();
            
            // Create new ones
            $tasks = json_decode($request->project_description, true);
            
            if (is_array($tasks)) {
                foreach ($tasks as $index => $task) {
                    ProjectDescription::create([
                        'project_management_id' => $project->id,
                        'description' => $task['text'] ?? '',
                        'completed' => $task['completed'] ?? false,
                        'sort' => $index + 1
                    ]);
                }
            }
        }

        return response()->json([
            'status' => true,
            'message' => 'Project updated successfully',
            'data' => $project->load('descriptions')
        ]);
    }

    /**
     * Delete project
     */
    public function destroy($id)
    {
        $project = ProjectManagement::findOrFail($id);
        $project->descriptions()->delete();
        $project->delete();

        return response()->json([
            'status' => true,
            'message' => 'Project deleted successfully'
        ]);
    }
}