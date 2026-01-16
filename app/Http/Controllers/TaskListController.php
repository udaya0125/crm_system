<?php

namespace App\Http\Controllers;

use App\Models\TaskList;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TaskListController extends Controller
{
    /**
     * Display a listing of task lists
     */
    public function index()
    {
        $user = Auth::user();

        // Admin can see all tasks
        if ($user->role === 'admin') {
            $taskLists = TaskList::with(['creator', 'assignedUser'])
                ->latest()
                ->get();
        } else {
            // Regular users can only see tasks assigned to them
            $taskLists = TaskList::with(['creator', 'assignedUser'])
                ->where('assigned_to', $user->id)
                ->latest()
                ->get();
        }

        return response()->json([
            'success' => true,
            'data' => $taskLists,
        ], 200);
    }

    /**
     * Store a newly created task list (Admin only)
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        // Double check middleware - only admin can access
        if ($user->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Only admins can assign tasks',
            ], 403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'user_id' => 'required|exists:users,id',
        ]);

        // Verify the assigned user exists
        $assignedUser = User::find($validated['user_id']);
        if (! $assignedUser) {
            return response()->json([
                'success' => false,
                'message' => 'Assigned user not found',
            ], 404);
        }

        // Create the task list
        $taskList = TaskList::create([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'user_id' => $user->id, // Creator (admin)
            'assigned_to' => $validated['user_id'], // Assigned user
        ]);

        // Load relationships for response
        $taskList->load(['creator', 'assignedUser']);

        return response()->json([
            'success' => true,
            'message' => 'Task assigned successfully',
            'data' => $taskList,
        ], 201);
    }

    /**
     * Update the specified task list (Admin only)
     */
    public function update(Request $request, $id)
    {
        $user = Auth::user();

        if ($user->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Only admins can update tasks',
            ], 403);
        }

        $taskList = TaskList::find($id);

        if (! $taskList) {
            return response()->json([
                'success' => false,
                'message' => 'Task list not found',
            ], 404);
        }

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'user_id' => 'sometimes|required|exists:users,id',
        ]);

        // Update assigned user if provided
        if (isset($validated['user_id'])) {
            $assignedUser = User::find($validated['user_id']);
            if (! $assignedUser) {
                return response()->json([
                    'success' => false,
                    'message' => 'Assigned user not found',
                ], 404);
            }
            $taskList->assigned_to = $validated['user_id'];
        }

        $taskList->title = $validated['title'] ?? $taskList->title;
        $taskList->description = $validated['description'] ?? $taskList->description;
        $taskList->save();

        // Load relationships for response
        $taskList->load(['creator', 'assignedUser']);

        return response()->json([
            'success' => true,
            'message' => 'Task updated successfully',
            'data' => $taskList,
        ], 200);
    }

    /**
     * Remove the specified task list (Admin only)
     */
    public function destroy($id)
    {
        $user = Auth::user();

        if ($user->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Only admins can delete tasks',
            ], 403);
        }

        $taskList = TaskList::find($id);

        if (! $taskList) {
            return response()->json([
                'success' => false,
                'message' => 'Task list not found',
            ], 404);
        }

        // Delete related tasks first
        $taskList->tasks()->delete();
        $taskList->delete();

        return response()->json([
            'success' => true,
            'message' => 'Task deleted successfully',
        ], 200);
    }
}
