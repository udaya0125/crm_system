<?php

namespace App\Http\Controllers;

use App\Models\Todo;
use App\Models\TodoDescription;
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

        $todo->update([
            'title' => $request->title,
            'due_date' => $request->due_date,
            'is_completed' => $request->is_completed ?? $todo->is_completed,
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

        $todo->delete();

        return response()->json([
            'status' => true,
            'message' => 'Todo deleted successfully',
        ]);
    }
}
