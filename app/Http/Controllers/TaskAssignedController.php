<?php

namespace App\Http\Controllers;

use App\Models\TaskAssigned;
use App\Models\TaskAttachment;
use App\Models\TaskItem;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class TaskAssignedController extends Controller
{
    /**
     * Display all tasks
     */
    public function index()
    {
        $tasks = TaskAssigned::with([
            'attachments',
            'taskItems',
            'assignedUser:id,name,role,email',
            'creator:id,name,role,email',
        ])->latest()->get();

        return response()->json($tasks);
    }

    /**
     * Store a newly created task
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'assigned_team' => 'required|exists:users,id', // who the task is assigned TO
            'user_id' => 'required|exists:users,id',      // who is assigning it
            'priority' => 'required|string',
            'start_date' => 'required|date',
            'due_date' => 'required|date|after_or_equal:start_date',
            'description' => 'nullable|string',

            'attachments.*' => 'nullable|file|max:10240', // 10MB each

            'task_items' => 'nullable|array',
            'task_items.*.description' => 'required|string',
            'task_items.*.status' => 'nullable|string',
        ]);

        DB::beginTransaction();

        try {
            $assignedUser = User::findOrFail($request->assigned_team);

            $task = TaskAssigned::create([
                'title' => $request->title,
                'department' => $assignedUser->role, // snapshot of assignee's role at creation time
                'assigned_team' => $assignedUser->id,
                'user_id' => $request->user_id,
                'priority' => $request->priority,
                'start_date' => $request->start_date,
                'due_date' => $request->due_date,
                'description' => $request->description,
                'status' => 'Pending',
            ]);

            /**
             * Upload Attachments
             */
            if ($request->hasFile('attachments')) {
                foreach ($request->file('attachments') as $file) {
                    $path = $file->store('task_attachments', 'public');

                    $task->attachments()->create([
                        'attachment' => $path,
                    ]);
                }
            }

            /**
             * Store Task Items
             */
            if ($request->filled('task_items')) {
                foreach ($request->task_items as $index => $item) {
                    $task->taskItems()->create([
                        'description' => $item['description'],
                        'status' => $item['status'] ?? 'Pending',
                        'sort_order' => $index + 1,
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Task Created Successfully',
                'data' => $task->load('attachments', 'taskItems', 'assignedUser', 'creator'),
            ]);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update Task
     */
    public function update(Request $request, $id)
    {
        $task = TaskAssigned::with([
            'attachments',
            'taskItems',
        ])->findOrFail($id);

        $request->validate([
            'title' => 'required|string|max:255',
            'assigned_team' => 'required|exists:users,id',
            'user_id' => 'required|exists:users,id',
            'priority' => 'required|string',
            'start_date' => 'required|date',
            'due_date' => 'required|date|after_or_equal:start_date',
            'description' => 'nullable|string',
            'status' => 'nullable|string',

            'attachments.*' => 'nullable|file|max:10240',

            'task_items' => 'nullable|array',
            'task_items.*.description' => 'required|string',
            'task_items.*.status' => 'nullable|string',
        ]);

        DB::beginTransaction();

        try {
            $assignedUser = User::findOrFail($request->assigned_team);

            $task->update([
                'title' => $request->title,
                'department' => $assignedUser->role, // re-derived in case assignee changed
                'assigned_team' => $assignedUser->id,
                'user_id' => $request->user_id,
                'priority' => $request->priority,
                'start_date' => $request->start_date,
                'due_date' => $request->due_date,
                'description' => $request->description,
                'status' => $request->status ?? $task->status,
                'admin_remarks' => $request->admin_remarks,
                'admin_status' => $request->admin_status,
            ]);

            /**
             * Upload New Attachments (appends to existing ones)
             */
            if ($request->hasFile('attachments')) {
                foreach ($request->file('attachments') as $file) {
                    $path = $file->store('task_attachments', 'public');

                    $task->attachments()->create([
                        'attachment' => $path,
                    ]);
                }
            }

            /**
             * Replace Task Items
             */
            if ($request->filled('task_items')) {
                $task->taskItems()->delete();

                foreach ($request->task_items as $index => $item) {
                    $task->taskItems()->create([
                        'description' => $item['description'],
                        'status' => $item['status'] ?? 'Pending',
                        'sort_order' => $index + 1,
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Task Updated Successfully',
                'data' => $task->load('attachments', 'taskItems', 'assignedUser', 'creator'),
            ]);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete Task
     */
    public function destroy($id)
    {
        $task = TaskAssigned::with([
            'attachments',
            'taskItems',
        ])->findOrFail($id);

        DB::beginTransaction();

        try {
            /**
             * Delete Files
             */
            foreach ($task->attachments as $attachment) {
                if (Storage::disk('public')->exists($attachment->attachment)) {
                    Storage::disk('public')->delete($attachment->attachment);
                }
            }

            $task->attachments()->delete();
            $task->taskItems()->delete();
            $task->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Task Deleted Successfully',
            ]);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete a single attachment from a task
     */
    public function destroyAttachment($taskId, $attachmentId)
    {
        $task = TaskAssigned::findOrFail($taskId);
        $attachment = TaskAttachment::where('task_assigned_id', $task->id)
            ->findOrFail($attachmentId);

        try {
            if (Storage::disk('public')->exists($attachment->attachment)) {
                Storage::disk('public')->delete($attachment->attachment);
            }

            $attachment->delete();

            return response()->json([
                'success' => true,
                'message' => 'Attachment removed successfully',
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}