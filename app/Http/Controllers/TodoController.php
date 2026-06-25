<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTodoRequest;
use App\Http\Requests\UpdateTodoRequest;
use App\Models\Todo;
use App\Models\TodoDescription;
use App\Models\Notification;
use Illuminate\Support\Facades\Auth;

class TodoController extends Controller
{
    /**
     * Display all todos of authenticated user.
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
     * Store a new todo.
     */
    public function store(StoreTodoRequest $request)
    {
        $validated = $request->validated();

        $todo = Todo::create([
            'user_id' => Auth::id(),
            'title' => $validated['title'],
            'due_date' => $validated['due_date'] ?? null,
            'is_completed' => false,
        ]);

        if (!empty($validated['descriptions'])) {
            foreach ($validated['descriptions'] as $description) {
                TodoDescription::create([
                    'todo_id' => $todo->id,
                    'description' => $description,
                ]);
            }
        }

        Notification::create([
            'message' => Auth::user()->name . ' created a new task: ' . $todo->title,
            'is_read' => false,
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Todo created successfully.',
            'data' => $todo->load('descriptions'),
        ], 201);
    }

    /**
     * Show a specific todo.
     */
    public function show($id)
    {
        $todo = Todo::with('descriptions')
            ->where('user_id', Auth::id())
            ->findOrFail($id);

        return response()->json([
            'status' => true,
            'data' => $todo,
        ]);
    }

    /**
     * Update todo.
     */
    public function update(UpdateTodoRequest $request, $id)
    {
        $todo = Todo::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $validated = $request->validated();

        $wasCompleted = $todo->is_completed;
        $isNowCompleted = $validated['is_completed'] ?? $todo->is_completed;

        $todo->update([
            'title' => $validated['title'],
            'due_date' => $validated['due_date'] ?? null,
            'is_completed' => $isNowCompleted,
        ]);

        if (array_key_exists('descriptions', $validated)) {
            $todo->descriptions()->delete();

            foreach ($validated['descriptions'] ?? [] as $description) {
                TodoDescription::create([
                    'todo_id' => $todo->id,
                    'description' => $description,
                ]);
            }
        }

        $notificationMessage =
            Auth::user()->name . ' updated the task: ' . $todo->title;

        if (!$wasCompleted && $isNowCompleted) {
            $notificationMessage =
                Auth::user()->name . ' completed the task: ' . $todo->title;
        }

        Notification::create([
            'message' => $notificationMessage,
            'is_read' => false,
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Todo updated successfully.',
            'data' => $todo->load('descriptions'),
        ]);
    }

    /**
     * Delete todo.
     */
    public function destroy($id)
    {
        $todo = Todo::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $todoTitle = $todo->title;

        $todo->delete();

        Notification::create([
            'message' => Auth::user()->name . ' deleted the task: ' . $todoTitle,
            'is_read' => false,
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Todo deleted successfully.',
        ]);
    }
}