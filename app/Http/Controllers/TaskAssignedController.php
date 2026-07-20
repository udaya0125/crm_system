<?php

namespace App\Http\Controllers;

use App\Http\Requests\ReviewTaskAssignedRequest;
use App\Http\Requests\StoreTaskAssignedRequest;
use App\Http\Requests\UpdateTaskAssignedRequest;
use App\Models\TaskAssigned;
use App\Models\UserLog;
use App\Services\TaskAssignedService;
use Illuminate\Http\Request;

class TaskAssignedController extends Controller
{
    public function __construct(private readonly TaskAssignedService $tasks)
    {
    }

    /**
     * Display all tasks — admins/managers see everything, everyone else
     * only sees tasks assigned to them or created by them.
     */
    public function index(Request $request)
    {
        return response()->json(
            $this->tasks->paginatedFor($request->user())
        );
    }

    /**
     * Aggregated report data for dashboards:
     * - task counts grouped by assigned agent
     * - task counts grouped by status
     * Scoped the same way index() is: privileged roles see everything,
     * everyone else sees only tasks assigned to or created by them.
     */
    public function reportSummary(Request $request)
    {
        $user = $request->user();
        $table = (new TaskAssigned())->getTable();

        $scope = function ($query) use ($user) {
            if (! $this->tasks->isPrivileged($user)) {
                $query->where(function ($q) use ($user) {
                    $q->where('assigned_team', $user->id)
                        ->orWhere('user_id', $user->id);
                });
            }
        };

        $byAgentQuery = TaskAssigned::query()
            ->join('users', 'users.id', '=', "{$table}.assigned_team")
            ->selectRaw('users.id as agent_id, users.name as agent, COUNT(*) as total')
            ->groupBy('users.id', 'users.name')
            ->orderByDesc('total');
        $scope($byAgentQuery);
        $byAgent = $byAgentQuery->get();

        $byStatusQuery = TaskAssigned::query()
            ->selectRaw('status, COUNT(*) as total')
            ->groupBy('status')
            ->orderByDesc('total');
        $scope($byStatusQuery);
        $byStatus = $byStatusQuery->get();

        return response()->json([
            'success' => true,
            'by_agent' => $byAgent,
            'by_status' => $byStatus,
            'total_tasks' => $byStatus->sum('total'),
        ]);
    }

    /**
     * Monthly count of *completed* tasks, broken down by the assignee's
     * role, for a line-chart trend view. Window defaults to 6 months and
     * is capped at 24 via ?months=.
     *
     * "Done" is defined as status Closed/Completed (case-insensitive) —
     * adjust the whereIn list below if your status values differ.
     */
    public function monthlyByRole(Request $request)
    {
        $user = $request->user();
        $table = (new TaskAssigned())->getTable();

        $months = max(1, min((int) $request->query('months', 6), 24));
        $start = now()->subMonths($months - 1)->startOfMonth();

        $query = TaskAssigned::query()
            ->join('users', 'users.id', '=', "{$table}.assigned_team")
            ->where("{$table}.updated_at", '>=', $start)
            ->whereRaw('LOWER(status) IN (?, ?)', ['closed', 'completed'])
            ->selectRaw(
                "DATE_FORMAT({$table}.updated_at, '%Y-%m') as month_key, ".
                "COALESCE(users.role, 'unknown') as role, ".
                'COUNT(*) as total'
            )
            ->groupBy('month_key', 'role');

        if (! $this->tasks->isPrivileged($user)) {
            $query->where(function ($q) use ($user, $table) {
                $q->where("{$table}.assigned_team", $user->id)
                    ->orWhere("{$table}.user_id", $user->id);
            });
        }

        $rows = $query->get();
        $roles = $rows->pluck('role')->unique()->sort()->values();

        // Build every month in the window (even ones with zero completions)
        // so the line chart doesn't show gaps.
        $series = collect(range(0, $months - 1))->map(function ($i) use ($months, $rows, $roles) {
            $date = now()->subMonths($months - 1 - $i);
            $key = $date->format('Y-m');

            $entry = [
                'monthKey' => $key,
                'month' => $date->format('M Y'),
            ];
            foreach ($roles as $role) {
                $match = $rows->first(fn ($r) => $r->month_key === $key && $r->role === $role);
                $entry[$role] = (int) ($match->total ?? 0);
            }

            return $entry;
        })->values();

        return response()->json([
            'success' => true,
            'roles' => $roles,
            'series' => $series,
        ]);
    }

    /**
     * Store a newly created task.
     */
    public function store(StoreTaskAssignedRequest $request)
    {
        try {
            $task = $this->tasks->create(
                $request->validated(),
                $request->file('attachments'),
                $request->input('task_items')
            );

            UserLog::create([
                'name'       => $request->user()?->name ?? 'System',
                'ip_address' => $request->ip(),
                'title'      => "Created task: \"{$task->title}\"",
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Task Created Successfully',
                'data' => $task,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update Task.
     * Authorization (ownership/privilege + "completed is locked") and
     * validation both live in UpdateTaskAssignedRequest.
     */
    public function update(UpdateTaskAssignedRequest $request, $id)
    {
        try {
            $task = $this->tasks->update(
                $request->attributes->get('task'),
                $request->validated(),
                $request->file('attachments'),
                $request->input('task_items')
            );

            UserLog::create([
                'name'       => $request->user()?->name ?? 'System',
                'ip_address' => $request->ip(),
                'title'      => "Updated task: \"{$task->title}\"",
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Task Updated Successfully',
                'data' => $task,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Admin/manager review of a completed task.
     * Authorization (privileged-only, task must be Completed, not already
     * Approved) and validation both live in ReviewTaskAssignedRequest.
     */
    public function review(ReviewTaskAssignedRequest $request, $id)
    {
        try {
            $task = $this->tasks->review(
                $request->attributes->get('task'),
                $request->admin_status,
                $request->admin_remarks
            );

            UserLog::create([
                'name'       => $request->user()?->name ?? 'System',
                'ip_address' => $request->ip(),
                'title'      => $request->admin_status === TaskAssignedService::ADMIN_STATUS_REOPENED
                    ? "Reopened task: \"{$task->title}\""
                    : "Approved task: \"{$task->title}\"",
            ]);

            return response()->json([
                'success' => true,
                'message' => $request->admin_status === TaskAssignedService::ADMIN_STATUS_REOPENED
                    ? 'Task reopened — assignee can edit it again.'
                    : 'Task approved and finalized.',
                'data' => $task,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete Task
     */
    public function destroy(Request $request, $id)
    {
        $task = TaskAssigned::with(['attachments', 'taskItems'])->findOrFail($id);
        $user = $request->user();

        if (! $this->tasks->isPrivileged($user) && ! $this->tasks->ownsTask($user, $task)) {
            return response()->json([
                'success' => false,
                'message' => 'You are not authorized to delete this task.',
            ], 403);
        }

        try {
            $taskTitle = $task->title;

            $this->tasks->delete($task);

            UserLog::create([
                'name'       => $user?->name ?? 'System',
                'ip_address' => $request->ip(),
                'title'      => "Deleted task: \"{$taskTitle}\"",
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Task Deleted Successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete a single attachment from a task
     */
    public function destroyAttachment(Request $request, $taskId, $attachmentId)
    {
        $task = TaskAssigned::findOrFail($taskId);
        $user = $request->user();

        if (! $this->tasks->isPrivileged($user) && ! $this->tasks->ownsTask($user, $task)) {
            return response()->json([
                'success' => false,
                'message' => 'You are not authorized to modify this task.',
            ], 403);
        }

        // Completed tasks are locked — attachments can no longer be removed,
        // mirroring the same rule enforced in update().
        if ($task->status === 'Completed') {
            return response()->json([
                'success' => false,
                'message' => 'This task is completed; attachments cannot be removed.',
            ], 403);
        }

        try {
            $this->tasks->deleteAttachment($task, $attachmentId);

            UserLog::create([
                'name'       => $user?->name ?? 'System',
                'ip_address' => $request->ip(),
                'title'      => "Removed an attachment from task: \"{$task->title}\"",
            ]);

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