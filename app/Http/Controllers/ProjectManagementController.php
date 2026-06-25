<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProjectManagement\StoreProjectManagementRequest;
use App\Http\Requests\ProjectManagement\UpdateProjectManagementRequest;
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
        $projects = ProjectManagement::with(['descriptions', 'assignedUser'])
            ->latest()
            ->get();

        $transformedProjects = $projects->map(function ($project) {
            $projectArray = $project->toArray();

            $tasks = $project->descriptions->map(function ($desc) {
                return [
                    'id'        => $desc->id,
                    'text'      => $desc->description,
                    'completed' => (bool) $desc->completed,
                ];
            })->toArray();

            $projectArray['project_description'] = json_encode($tasks);
            $projectArray['assigned_team_name'] = $project->assignedUser?->name ?? '—';

            return $projectArray;
        });

        return response()->json([
            'status' => true,
            'data'   => $transformedProjects,
        ]);
    }

    /**
     * Store new project
     */
    public function store(StoreProjectManagementRequest $request)
    {
        $project = ProjectManagement::create(
            $request->safe()->except('project_description')
        );

        if ($request->filled('project_description')) {
            $tasks = json_decode($request->project_description, true);

            if (is_array($tasks)) {
                foreach ($tasks as $index => $task) {
                    ProjectDescription::create([
                        'project_management_id' => $project->id,
                        'description'           => $task['text'] ?? '',
                        'completed'             => $task['completed'] ?? false,
                        'sort'                  => $index + 1,
                    ]);
                }
            }
        }

        $project->load(['descriptions', 'assignedUser']);

        $projectData = $project->toArray();
        $projectData['assigned_team_name'] =
            $project->assignedUser?->name ?? '—';

        UserLog::create([
            'name'       => $request->user()?->name ?? 'System',
            'ip_address' => $request->ip(),
            'title'      => "Created project: {$project->project_title} for {$project->client_name}",
        ]);

        return response()->json([
            'status'  => true,
            'message' => 'Project created successfully',
            'data'    => $projectData,
        ], 201);
    }

    /**
     * Update project
     */
    public function update(UpdateProjectManagementRequest $request, $id)
    {
        $project = ProjectManagement::findOrFail($id);

        $project->update(
            $request->safe()->except('project_description')
        );

        if ($request->has('project_description')) {
            $project->descriptions()->delete();

            $tasks = json_decode($request->project_description, true);

            if (is_array($tasks)) {
                foreach ($tasks as $index => $task) {
                    ProjectDescription::create([
                        'project_management_id' => $project->id,
                        'description'           => $task['text'] ?? '',
                        'completed'             => $task['completed'] ?? false,
                        'sort'                  => $index + 1,
                    ]);
                }
            }
        }

        $project->load(['descriptions', 'assignedUser']);

        $projectData = $project->toArray();
        $projectData['assigned_team_name'] =
            $project->assignedUser?->name ?? '—';

        UserLog::create([
            'name'       => $request->user()?->name ?? 'System',
            'ip_address' => $request->ip(),
            'title'      => "Updated project: {$project->project_title} for {$project->client_name}",
        ]);

        return response()->json([
            'status'  => true,
            'message' => 'Project updated successfully',
            'data'    => $projectData,
        ]);
    }

    /**
     * Delete project
     */
    public function destroy($id)
    {
        $project = ProjectManagement::findOrFail($id);

        $projectTitle = $project->project_title;
        $clientName = $project->client_name;

        $project->descriptions()->delete();
        $project->delete();

        UserLog::create([
            'name'       => auth()->user()?->name ?? 'System',
            'ip_address' => request()->ip(),
            'title'      => "Deleted project: {$projectTitle} for {$clientName}",
        ]);

        return response()->json([
            'status'  => true,
            'message' => 'Project deleted successfully',
        ]);
    }
}