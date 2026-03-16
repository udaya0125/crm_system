<?php

namespace App\Http\Controllers;

use App\Models\Todo;
use App\Models\TodoDescription;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TodoController extends Controller
{
    /**
     * Get all todos
     */
    public function index()
    {
        $todos = Todo::with('descriptions')
            ->where('user_id', Auth::id())
            ->latest()
            ->get();

        return response()->json([
            'status' => true,
            'data' => $todos,
        ]);
    }

    /**
     * Store new todo
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'due_date' => 'nullable|date',
            'descriptions' => 'nullable|array',
            'descriptions.*' => 'string',
        ]);

        $todo = Todo::create([
            'user_id' => Auth::id(),
            'title' => $request->title,
            'due_date' => $request->due_date,
            'is_completed' => false,
        ]);

        if ($request->descriptions) {
            foreach ($request->descriptions as $desc) {
                TodoDescription::create([
                    'todo_id' => $todo->id,
                    'description' => $desc,
                ]);
            }
        }

        // Create notification for new todo
        $userName = Auth::user()->name;
        Notification::create([
            'message' => "{$userName} created a new task: {$todo->title}",
            'is_read' => false,
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Todo created successfully',
            'data' => $todo->load('descriptions'),
        ], 201);
    }

    /**
     * Update todo
     */
    public function update(Request $request, $id)
    {
        $todo = Todo::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $request->validate([
            'title' => 'required|string|max:255',
            'due_date' => 'nullable|date',
            'is_completed' => 'boolean',
            'descriptions' => 'nullable|array',
            'descriptions.*' => 'string',
        ]);

        $wasCompleted = $todo->is_completed;
        $isNowCompleted = $request->is_completed ?? $todo->is_completed;

        $todo->update([
            'title' => $request->title,
            'due_date' => $request->due_date,
            'is_completed' => $isNowCompleted,
        ]);

        if ($request->descriptions) {
            $todo->descriptions()->delete();

            foreach ($request->descriptions as $desc) {
                TodoDescription::create([
                    'todo_id' => $todo->id,
                    'description' => $desc,
                ]);
            }
        }

        // Create notification for updated todo
        $userName = Auth::user()->name;
        $notificationMessage = "{$userName} updated the task: {$todo->title}";
        
        // Special message if task was just completed
        if (!$wasCompleted && $isNowCompleted) {
            $notificationMessage = "{$userName} completed the task: {$todo->title}";
        }

        Notification::create([
            'message' => $notificationMessage,
            'is_read' => false,
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Todo updated successfully',
            'data' => $todo->load('descriptions'),
        ]);
    }

    /**
     * Delete todo
     */
    public function destroy($id)
    {
        $todo = Todo::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $todoTitle = $todo->title;
        $userName = Auth::user()->name;
        
        $todo->delete();

        // Create notification for deleted todo
        Notification::create([
            'message' => "{$userName} deleted the task: {$todoTitle}",
            'is_read' => false,
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Todo deleted successfully',
        ]);
    }
}