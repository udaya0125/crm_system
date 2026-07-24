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
 * Every user (id, name, role), unfiltered — powers the Task Report
 * "select a team member" dropdown so it always lists everyone, not just
 * users who currently have a matching task. Route name:
 * ourtaskreport.teammembers.
 */
public function teamMembers(Request $request)
{
    return response()->json([
        'success' => true,
        'data' => $this->tasks->allTeamMembers(),
    ]);
}

  /**
 * Task Report page: every team member who has at least one task
 * assigned to them, with total / completed / in-progress / pending
 * counts — powers the user-card grid. Route name: ourtaskreport.index.
 *
 * Query params (all optional), same filters the old task-row report
 * supported:
 * - search: matches the user's name
 * - role: matches the user's role
 * - status: only include users with at least one task of this status
 * - start_date / end_date: "YYYY-MM-DD" — bounds the counts to tasks
 *   whose own start_date falls in this range
 */
public function usersSummary(Request $request)
{
    return response()->json([
        'success' => true,
        'data' => $this->tasks->usersWithTaskCounts([
            'user_id' => $request->query('user_id'),
            'role' => $request->query('role'),
            'status' => $request->query('status'),
            'start_date' => $request->query('start_date'),
            'end_date' => $request->query('end_date'),
        ]),
    ]);
}

    /**
     * Task Report workload popup: every task assigned to one user (with
     * checklist items, assignee, creator) plus their aggregate stats.
     * Fetched the moment a user card on the Task Report page is clicked.
     * Route name: ourtaskreport.usertasks.
     */
    public function userTasks(Request $request, $userId)
    {
        return response()->json([
            'success' => true,
            'data' => $this->tasks->tasksForUser((int) $userId),
            'stats' => $this->tasks->userTaskStats((int) $userId),
        ]);
    }

    /**
     * Aggregated report data for dashboards:
     * - task counts grouped by assigned agent
     * - task counts grouped by status
     * Scoped the same way index() is: privileged roles see everything,
     * everyone else sees only tasks assigned to or created by them.
     *
     * Query params (all optional):
     * - scope: "agent" | "status" — return only that block. Omit to get both
     *   (kept for backward compatibility with any other callers).
     * - start_date / end_date: "YYYY-MM-DD" — filters on the task's own
     *   `start_date` column (when the task was started), NOT created_at.
     *
     * The frontend now sends two independent requests (one per chart),
     * each with its own scope + date range, so each chart can be filtered
     * without affecting the other.
     */
    public function reportSummary(Request $request)
    {
        $user = $request->user();
        $table = (new TaskAssigned())->getTable();

        $applyAuthScope = function ($query) use ($user, $table) {
            if (! $this->tasks->isPrivileged($user)) {
                $query->where(function ($q) use ($user, $table) {
                    $q->where("{$table}.assigned_team", $user->id)
                        ->orWhere("{$table}.user_id", $user->id);
                });
            }
        };

        $applyDateRange = function ($query) use ($request, $table) {
            if ($start = $request->query('start_date')) {
                $query->whereDate("{$table}.start_date", '>=', $start);
            }
            if ($end = $request->query('end_date')) {
                $query->whereDate("{$table}.start_date", '<=', $end);
            }
        };

        $requestedScope = $request->query('scope'); // 'agent' | 'status' | null

        $response = ['success' => true];

        if ($requestedScope === null || $requestedScope === 'agent') {
            $byAgentQuery = TaskAssigned::query()
                ->join('users', 'users.id', '=', "{$table}.assigned_team")
                ->selectRaw('users.id as agent_id, users.name as agent, COUNT(*) as total')
                ->groupBy('users.id', 'users.name')
                ->orderByDesc('total');
            $applyAuthScope($byAgentQuery);
            $applyDateRange($byAgentQuery);
            $response['by_agent'] = $byAgentQuery->get();
        }

        if ($requestedScope === null || $requestedScope === 'status') {
            $byStatusQuery = TaskAssigned::query()
                ->selectRaw('status, COUNT(*) as total')
                ->groupBy('status')
                ->orderByDesc('total');
            $applyAuthScope($byStatusQuery);
            $applyDateRange($byStatusQuery);
            $response['by_status'] = $byStatusQuery->get();
        }

        if (isset($response['by_status'])) {
            $response['total_tasks'] = $response['by_status']->sum('total');
        }

        return response()->json($response);
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

    /**
     * Monthly count of Completed tasks for a line-chart trend view,
     * filtered by the task's own `start_date` column. Falls back to
     * `created_at` for any Completed task where `start_date` is null,
     * so it never silently drops rows from the chart.
     *
     * Query params (all optional):
     * - start_date / end_date: "YYYY-MM-DD" — bounds the range. If omitted,
     *   the range defaults to the first/last month with completed data.
     */
    public function monthlySummary(Request $request)
    {
        $user = $request->user();
        $table = (new TaskAssigned())->getTable();

        $startDateParam = $request->query('start_date');
        $endDateParam = $request->query('end_date');

        $dateExpr = "COALESCE({$table}.start_date, {$table}.created_at)";

        $query = TaskAssigned::query()
            ->where("{$table}.status", 'Completed')
            ->selectRaw("DATE_FORMAT({$dateExpr}, '%Y-%m') as month_key, COUNT(*) as total")
            ->groupBy('month_key')
            ->orderBy('month_key');

        if ($startDateParam) {
            $query->whereRaw("DATE({$dateExpr}) >= ?", [$startDateParam]);
        }
        if ($endDateParam) {
            $query->whereRaw("DATE({$dateExpr}) <= ?", [$endDateParam]);
        }

        if (! $this->tasks->isPrivileged($user)) {
            $query->where(function ($q) use ($user, $table) {
                $q->where("{$table}.assigned_team", $user->id)
                    ->orWhere("{$table}.user_id", $user->id);
            });
        }

        $rows = $query->get();

        if ($rows->isEmpty()) {
            return response()->json(['success' => true, 'series' => []]);
        }

        $periodStart = $startDateParam
            ? \Carbon\Carbon::parse($startDateParam)->startOfMonth()
            : \Carbon\Carbon::createFromFormat('Y-m', $rows->first()->month_key)->startOfMonth();
        $periodEnd = $endDateParam
            ? \Carbon\Carbon::parse($endDateParam)->startOfMonth()
            : \Carbon\Carbon::createFromFormat('Y-m', $rows->last()->month_key)->startOfMonth();

        $byMonth = $rows->keyBy('month_key');
        $series = [];
        $cursor = $periodStart->copy();
        while ($cursor->lte($periodEnd)) {
            $key = $cursor->format('Y-m');
            $series[] = [
                'monthKey' => $key,
                'month' => $cursor->format('M Y'),
                'total' => (int) ($byMonth[$key]->total ?? 0),
            ];
            $cursor->addMonth();
        }

        return response()->json([
            'success' => true,
            'series' => $series,
        ]);
    }

    /**
     * Total task counts grouped by the assignee's role ("department"),
     * plus a Completed vs Pending/In Progress breakdown per role for the
     * hover tooltip. Filtered by the task's own `start_date` column
     * (falls back to created_at for any row with a null start_date).
     *
     * Query params (all optional):
     * - start_date / end_date: "YYYY-MM-DD"
     */
    public function departmentSummary(Request $request)
    {
        $user = $request->user();
        $table = (new TaskAssigned())->getTable();

        $dateExpr = "COALESCE({$table}.start_date, {$table}.created_at)";

        $query = TaskAssigned::query()
            ->join('users', 'users.id', '=', "{$table}.assigned_team")
            ->selectRaw(
                "COALESCE(users.role, 'unknown') as role, ".
                "COUNT(*) as total, ".
                "SUM(CASE WHEN LOWER({$table}.status) = 'completed' THEN 1 ELSE 0 END) as completed, ".
                "SUM(CASE WHEN LOWER({$table}.status) IN ('pending', 'in progress', 'inprogress') THEN 1 ELSE 0 END) as pending"
            )
            ->groupBy('role')
            ->orderByDesc('total');

        if ($start = $request->query('start_date')) {
            $query->whereRaw("DATE({$dateExpr}) >= ?", [$start]);
        }
        if ($end = $request->query('end_date')) {
            $query->whereRaw("DATE({$dateExpr}) <= ?", [$end]);
        }

        if (! $this->tasks->isPrivileged($user)) {
            $query->where(function ($q) use ($user, $table) {
                $q->where("{$table}.assigned_team", $user->id)
                    ->orWhere("{$table}.user_id", $user->id);
            });
        }

        $rows = $query->get()->map(fn ($r) => [
            'role' => ucfirst($r->role),
            'total' => (int) $r->total,
            'completed' => (int) $r->completed,
            'pending' => (int) $r->pending,
        ]);

        return response()->json([
            'success' => true,
            'by_role' => $rows,
        ]);
    }


    /**
 * Full nested task data (with checklist items + creator) for every
 * filtered team member — feeds the "Export PDF" button on the Task
 * Report page. Unlike usersSummary(), this returns every task's full
 * detail, not just counts, so the PDF can include everything the model
 * provides: assigned to/by, start/due dates, and every checklist item's
 * description, status, and completed_at.
 *
 * Query params: same as usersSummary() — search, role, status,
 * start_date, end_date.
 */
public function exportData(Request $request)
{
    return response()->json([
        'success' => true,
        'data' => $this->tasks->usersWithFullTasks([
            'user_id' => $request->query('user_id'),
            'role' => $request->query('role'),
            'status' => $request->query('status'),
            'start_date' => $request->query('start_date'),
            'end_date' => $request->query('end_date'),
        ]),
    ]);
}
}