<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; background-color: #f4f5f7; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 8px; overflow: hidden; }
        .header { padding: 24px; color: #ffffff; }
        .header h1 { margin: 0; font-size: 20px; }
        .header.assigned { background-color: #2563eb; }
        .header.completed { background-color: #16a34a; }
        .header.reopened { background-color: #dc2626; }
        .header.approved { background-color: #16a34a; }
        .body { padding: 24px; color: #1f2937; }
        .body p { line-height: 1.6; }
        .details { background-color: #f9fafb; border-radius: 6px; padding: 16px; margin: 16px 0; }
        .details table { width: 100%; border-collapse: collapse; }
        .details td { padding: 6px 0; font-size: 14px; }
        .details td.label { color: #6b7280; width: 130px; }
        .badge { display: inline-block; padding: 2px 10px; border-radius: 12px; font-size: 12px; }
        .badge.priority { background: #fef3c7; color: #92400e; }
        .badge.status { background: #dcfce7; color: #166534; }
        .remarks { background-color: #fff7ed; border-left: 4px solid #f97316; padding: 12px 16px; margin: 16px 0; font-size: 14px; }
        .footer { padding: 16px 24px; font-size: 12px; color: #9ca3af; text-align: center; }
    </style>
</head>
<body>
    <div class="container">

        {{-- Header --}}
        @if ($type === 'assigned')
            <div class="header assigned"><h1>New Task Assigned</h1></div>
        @elseif ($type === 'completed')
            <div class="header completed"><h1>Task Marked as Completed</h1></div>
        @elseif ($type === 'reviewed')
            <div class="header {{ $isReopened ? 'reopened' : 'approved' }}">
                <h1>{{ $isReopened ? 'Task Reopened' : 'Task Approved' }}</h1>
            </div>
        @endif

        <div class="body">

            {{-- ===================== ASSIGNED ===================== --}}
            @if ($type === 'assigned')
                <p>Hi {{ $task->assignedUser->name ?? 'there' }},</p>
                <p>A new task has been assigned to you. Here are the details:</p>

                <div class="details">
                    <table>
                        <tr><td class="label">Title</td><td><strong>{{ $task->title }}</strong></td></tr>
                        <tr><td class="label">Priority</td><td><span class="badge priority">{{ $task->priority }}</span></td></tr>
                        <tr><td class="label">Start Date</td><td>{{ \Carbon\Carbon::parse($task->start_date)->format('d M, Y') }}</td></tr>
                        <tr><td class="label">Due Date</td><td>{{ \Carbon\Carbon::parse($task->due_date)->format('d M, Y') }}</td></tr>
                        <tr><td class="label">Assigned By</td><td>{{ $task->creator->name ?? 'N/A' }}</td></tr>
                    </table>
                </div>

                @if ($task->description)
                    <p><strong>Description:</strong><br>{{ $task->description }}</p>
                @endif

                <p>Please log in to the dashboard to view the full task and checklist.</p>

            {{-- ===================== COMPLETED ===================== --}}
            @elseif ($type === 'completed')
                <p>Hi,</p>
                <p>A task requires your review — it has just been marked as completed by the assignee:</p>

                <div class="details">
                    <table>
                        <tr><td class="label">Title</td><td><strong>{{ $task->title }}</strong></td></tr>
                        <tr><td class="label">Status</td><td><span class="badge status">{{ $task->status }}</span></td></tr>
                        <tr><td class="label">Assigned To</td><td>{{ $task->assignedUser->name ?? 'N/A' }}</td></tr>
                        <tr><td class="label">Assigned By</td><td>{{ $task->creator->name ?? 'N/A' }}</td></tr>
                        <tr><td class="label">Due Date</td><td>{{ \Carbon\Carbon::parse($task->due_date)->format('d M, Y') }}</td></tr>
                    </table>
                </div>

                <p>Please log in to the dashboard to review this task and either approve it or reopen it with remarks.</p>

            {{-- ===================== REVIEWED ===================== --}}
            @elseif ($type === 'reviewed')
                <p>Hi {{ $task->assignedUser->name ?? 'there' }},</p>

                @if ($isReopened)
                    <p>Your completed task has been reviewed and reopened for further work:</p>
                @else
                    <p>Your completed task has been reviewed and approved. No further action is needed:</p>
                @endif

                <div class="details">
                    <table>
                        <tr><td class="label">Title</td><td><strong>{{ $task->title }}</strong></td></tr>
                        <tr><td class="label">Current Status</td><td>{{ $task->status }}</td></tr>
                        <tr><td class="label">Reviewed By</td><td>{{ $task->creator->name ?? 'Admin' }}</td></tr>
                    </table>
                </div>

                @if ($task->admin_remarks)
                    <div class="remarks">
                        <strong>Reviewer Remarks:</strong><br>
                        {{ $task->admin_remarks }}
                    </div>
                @endif

                @if ($isReopened)
                    <p>Please log in to the dashboard to make the required changes and resubmit as completed.</p>
                @endif
            @endif

        </div>
        <div class="footer">
            This is an automated notification. Please do not reply to this email.
        </div>
    </div>
</body>
</html>