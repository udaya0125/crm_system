<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\Notification;
use App\Models\UserLog;
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
            $tasks = Task::with([
                'taskList.assignedUser',
                'taskList.creator',
                'descriptions',
            ])->latest()->get();
        } else {
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
            'data'    => $tasks,
        ], 200);
    }

    /**
     * Store a newly created task
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'title'          => 'required|string|max:255',
            'is_completed'   => 'boolean',
            'due_date'       => 'nullable|date_format:d-m-y H:i',
            'task_list_id'   => 'required|exists:task_lists,id',
            'descriptions'   => 'nullable|array',
            'descriptions.*' => 'required|string',
        ]);

        $taskList = \App\Models\TaskList::find($validated['task_list_id']);

        if ($user->role === 'user' && $taskList->assigned_to !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'You can only create tasks in your assigned task lists',
            ], 403);
        }

        $dueDate = null;
        $dueTime = null;

        if (! empty($validated['due_date'])) {
            $dateTime = Carbon::createFromFormat('d-m-y H:i', $validated['due_date']);
            $dueDate  = $dateTime->format('Y-m-d');
            $dueTime  = $dateTime->format('H:i:s');
        }

        $task = Task::create([
            'title'        => $validated['title'],
            'is_completed' => $validated['is_completed'] ?? false,
            'due_date'     => $dueDate,
            'due_time'     => $dueTime,
            'task_list_id' => $validated['task_list_id'],
        ]);

        if (! empty($validated['descriptions'])) {
            $descriptions = array_filter($validated['descriptions'], function ($content) {
                return ! empty(trim(strip_tags($content))) && $content !== '<p><br></p>';
            });

            foreach ($descriptions as $content) {
                $task->descriptions()->create([
                    'content' => $content,
                    'user_id' => $user->id,
                ]);
            }
        }

        Notification::create([
            'message' => "{$user->name} created a new task: {$task->title} in {$taskList->name}",
            'is_read' => false,
        ]);

        UserLog::create([
            'name'       => $user->name,
            'ip_address' => $request->ip(),
            'title'      => "Created task: {$task->title} in {$taskList->name}",
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Task created successfully',
            'data'    => $task->load('descriptions'),
        ], 201);
    }

    /**
     * Update the specified task
     */
    public function update(Request $request, $id)
    {
        $user = Auth::user();
        $task = Task::findOrFail($id);

        if ($user->role === 'user' && $task->taskList->assigned_to !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'You can only update tasks in your assigned task lists',
            ], 403);
        }

        $validated = $request->validate([
            'title'          => 'sometimes|required|string|max:255',
            'is_completed'   => 'boolean',
            'due_date'       => 'nullable|date_format:d-m-y H:i',
            'task_list_id'   => 'sometimes|required|exists:task_lists,id',
            'descriptions'   => 'nullable|array',
            'descriptions.*' => 'required|string',
        ]);

        if (isset($validated['task_list_id'])) {
            $newTaskList = \App\Models\TaskList::find($validated['task_list_id']);
            if ($user->role === 'user' && $newTaskList->assigned_to !== $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'You can only move tasks to your assigned task lists',
                ], 403);
            }
        }

        $wasCompleted  = $task->is_completed;
        $isNowCompleted = $validated['is_completed'] ?? $task->is_completed;

        $dueDate = null;
        $dueTime = null;

        if (! empty($validated['due_date'])) {
            $dateTime = Carbon::createFromFormat('d-m-y H:i', $validated['due_date']);
            $dueDate  = $dateTime->format('Y-m-d');
            $dueTime  = $dateTime->format('H:i:s');
        }

        $task->update([
            'title'        => $validated['title'] ?? $task->title,
            'is_completed' => $isNowCompleted,
            'due_date'     => $dueDate ?? $task->due_date,
            'due_time'     => $dueTime ?? $task->due_time,
            'task_list_id' => $validated['task_list_id'] ?? $task->task_list_id,
        ]);

        if ($request->has('descriptions')) {
            $descriptions = array_filter($validated['descriptions'], function ($content) {
                return ! empty(trim(strip_tags($content))) && $content !== '<p><br></p>';
            });

            $task->descriptions()->delete();

            foreach ($descriptions as $content) {
                $task->descriptions()->create([
                    'content' => $content,
                    'user_id' => $user->id,
                ]);
            }
        }

        $taskList            = $task->taskList;
        $notificationMessage = "{$user->name} updated the task: {$task->title}";

        if (! $wasCompleted && $isNowCompleted) {
            $notificationMessage = "{$user->name} completed the task: {$task->title}";
        }

        Notification::create([
            'message' => $notificationMessage,
            'is_read' => false,
        ]);

        // Log title reflects completion status change if applicable
        $logTitle = (! $wasCompleted && $isNowCompleted)
            ? "Completed task: {$task->title} in {$taskList->name}"
            : "Updated task: {$task->title} in {$taskList->name}";

        UserLog::create([
            'name'       => $user->name,
            'ip_address' => $request->ip(),
            'title'      => $logTitle,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Task updated successfully',
            'data'    => $task->load('descriptions'),
        ], 200);
    }

    /**
     * Remove the specified task
     */
    public function destroy(Request $request, $id)
    {
        $user         = Auth::user();
        $task         = Task::findOrFail($id);

        if ($user->role === 'user' && $task->taskList->assigned_to !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'You can only delete tasks from your assigned task lists',
            ], 403);
        }

        $taskTitle    = $task->title;
        $taskListName = $task->taskList->name;

        $task->descriptions()->delete();
        $task->delete();

        Notification::create([
            'message' => "{$user->name} deleted the task: {$taskTitle} from {$taskListName}",
            'is_read' => false,
        ]);

        UserLog::create([
            'name'       => $user->name,
            'ip_address' => $request->ip(),
            'title'      => "Deleted task: {$taskTitle} from {$taskListName}",
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Task deleted successfully',
        ], 200);
    }
}