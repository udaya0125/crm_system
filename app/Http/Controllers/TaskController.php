<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\Notification;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
    /**
     * Display a listing of tasks
     */
    public function index()
    {
        $user = Auth::user();

        if ($user->role === 'admin') {
            // Admin can see all tasks
            $tasks = Task::with([
                'taskList.assignedUser',
                'taskList.creator',
                'descriptions',
            ])->latest()->get();
        } else {
            // Regular users can only see tasks in task lists assigned to them
            $tasks = Task::with([
                'taskList.assignedUser',
                'taskList.creator',
                'descriptions',
            ])->whereHas('taskList', function ($query) use ($user) {
                $query->where('assigned_to', $user->id);
            })->latest()->get();
        }

        return response()->json([
            'success' => true,
            'data' => $tasks,
        ], 200);
    }

    /**
     * Store a newly created task
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'is_completed' => 'boolean',
            'due_date' => 'nullable|date_format:d-m-y H:i',
            'task_list_id' => 'required|exists:task_lists,id',
            'descriptions' => 'nullable|array',
            'descriptions.*' => 'required|string',
        ]);

        // Check if user can create task in this task list
        $taskList = \App\Models\TaskList::find($validated['task_list_id']);

        if ($user->role === 'user' && $taskList->assigned_to !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'You can only create tasks in your assigned task lists',
            ], 403);
        }

        // Parse due_date and separate into due_date and due_time
        $dueDate = null;
        $dueTime = null;

        if (! empty($validated['due_date'])) {
            $dateTime = Carbon::createFromFormat('d-m-y H:i', $validated['due_date']);
            $dueDate = $dateTime->format('Y-m-d');
            $dueTime = $dateTime->format('H:i:s');
        }

        $task = Task::create([
            'title' => $validated['title'],
            'is_completed' => $validated['is_completed'] ?? false,
            'due_date' => $dueDate,
            'due_time' => $dueTime,
            'task_list_id' => $validated['task_list_id'],
        ]);

        // Save descriptions
        if (! empty($validated['descriptions'])) {
            $descriptions = array_filter($validated['descriptions'], function ($content) {
                return ! empty(trim(strip_tags($content))) && $content !== '<p><br></p>';
            });

            foreach ($descriptions as $content) {
                $task->descriptions()->create([
                    'content' => $content,
                    'user_id' => $user->id, // Track who added the description
                ]);
            }
        }

        // Create notification for new task
        Notification::create([
            'message' => "{$user->name} created a new task: {$task->title} in {$taskList->name}",
            'is_read' => false,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Task created successfully',
            'data' => $task->load('descriptions'),
        ], 201);
    }

    /**
     * Update the specified task
     */
    public function update(Request $request, $id)
    {
        $user = Auth::user();
        $task = Task::findOrFail($id);

        // Check permissions
        if ($user->role === 'user' && $task->taskList->assigned_to !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'You can only update tasks in your assigned task lists',
            ], 403);
        }

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'is_completed' => 'boolean',
            'due_date' => 'nullable|date_format:d-m-y H:i',
            'task_list_id' => 'sometimes|required|exists:task_lists,id',
            'descriptions' => 'nullable|array',
            'descriptions.*' => 'required|string',
        ]);

        // Check task_list_id permissions if changing
        if (isset($validated['task_list_id'])) {
            $newTaskList = \App\Models\TaskList::find($validated['task_list_id']);
            if ($user->role === 'user' && $newTaskList->assigned_to !== $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'You can only move tasks to your assigned task lists',
                ], 403);
            }
        }

        // Track completion status change
        $wasCompleted = $task->is_completed;
        $isNowCompleted = $validated['is_completed'] ?? $task->is_completed;

        // Parse due_date
        $dueDate = null;
        $dueTime = null;

        if (! empty($validated['due_date'])) {
            $dateTime = Carbon::createFromFormat('d-m-y H:i', $validated['due_date']);
            $dueDate = $dateTime->format('Y-m-d');
            $dueTime = $dateTime->format('H:i:s');
        }

        // Update task
        $taskData = [
            'title' => $validated['title'] ?? $task->title,
            'is_completed' => $isNowCompleted,
            'due_date' => $dueDate ?? $task->due_date,
            'due_time' => $dueTime ?? $task->due_time,
            'task_list_id' => $validated['task_list_id'] ?? $task->task_list_id,
        ];

        $task->update($taskData);

        // Replace descriptions if provided
        if ($request->has('descriptions')) {
            $descriptions = array_filter($validated['descriptions'], function ($content) {
                return ! empty(trim(strip_tags($content))) && $content !== '<p><br></p>';
            });

            // Delete old descriptions
            $task->descriptions()->delete();

            // Create new descriptions
            foreach ($descriptions as $content) {
                $task->descriptions()->create([
                    'content' => $content,
                    'user_id' => $user->id,
                ]);
            }
        }

        // Create notification for updated task
        $taskList = $task->taskList;
        $notificationMessage = "{$user->name} updated the task: {$task->title}";
        
        // Special message if task was just completed
        if (!$wasCompleted && $isNowCompleted) {
            $notificationMessage = "{$user->name} completed the task: {$task->title}";
        }

        Notification::create([
            'message' => $notificationMessage,
            'is_read' => false,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Task updated successfully',
            'data' => $task->load('descriptions'),
        ], 200);
    }

    /**
     * Remove the specified task
     */
    public function destroy($id)
    {
        $user = Auth::user();
        $task = Task::findOrFail($id);

        // Check permissions
        if ($user->role === 'user' && $task->taskList->assigned_to !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'You can only delete tasks from your assigned task lists',
            ], 403);
        }

        // Store task title and list name before deletion
        $taskTitle = $task->title;
        $taskListName = $task->taskList->name;

        $task->descriptions()->delete();
        $task->delete();

        // Create notification for deleted task
        Notification::create([
            'message' => "{$user->name} deleted the task: {$taskTitle} from {$taskListName}",
            'is_read' => false,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Task deleted successfully',
        ], 200);
    }
}