<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Ticket Notification</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: 'Segoe UI', Arial, sans-serif;
            background-color: #f0f4f8;
            color: #333;
            padding: 32px 16px;
        }

        .wrapper {
            max-width: 620px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }

        /* ── Header ── */
        .header {
            background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
            padding: 36px 40px;
            text-align: center;
        }

        .header .logo-text {
            font-size: 22px;
            font-weight: 700;
            color: #ffffff;
            letter-spacing: 1px;
        }

        .header .logo-sub {
            font-size: 13px;
            color: #bfdbfe;
            margin-top: 4px;
        }

        /* ── Badge ── */
        .badge-wrap {
            text-align: center;
            padding: 28px 40px 0;
        }

        .badge {
            display: inline-block;
            padding: 6px 18px;
            border-radius: 999px;
            font-size: 12px;
            font-weight: 600;
            letter-spacing: 0.5px;
            text-transform: uppercase;
        }

        .badge-technician { background: #dbeafe; color: #1d4ed8; }
        .badge-client     { background: #dcfce7; color: #15803d; }
        .badge-admin      { background: #fef3c7; color: #b45309; }

        /* ── Body ── */
        .body {
            padding: 24px 40px 36px;
        }

        .greeting {
            font-size: 20px;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 10px;
        }

        .intro {
            font-size: 14px;
            color: #64748b;
            line-height: 1.6;
            margin-bottom: 28px;
        }

        /* ── Ticket Card ── */
        .ticket-card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            overflow: hidden;
            margin-bottom: 28px;
        }

        .ticket-card-header {
            background: #1e40af;
            padding: 12px 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .ticket-card-header .ticket-id {
            font-size: 15px;
            font-weight: 700;
            color: #ffffff;
            letter-spacing: 0.5px;
        }

        .ticket-card-header .created-at {
            font-size: 12px;
            color: #bfdbfe;
        }

        .ticket-card-body {
            padding: 20px;
        }

        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 14px;
        }

        .info-item {
            display: flex;
            flex-direction: column;
            gap: 3px;
        }

        .info-item.full-width {
            grid-column: 1 / -1;
        }

        .info-label {
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #94a3b8;
        }

        .info-value {
            font-size: 14px;
            color: #1e293b;
            font-weight: 500;
        }

        /* Priority badges */
        .priority {
            display: inline-block;
            padding: 2px 10px;
            border-radius: 999px;
            font-size: 12px;
            font-weight: 600;
        }
        .priority-low      { background: #dcfce7; color: #16a34a; }
        .priority-medium   { background: #fef9c3; color: #ca8a04; }
        .priority-high     { background: #fee2e2; color: #dc2626; }
        .priority-critical { background: #fce7f3; color: #9d174d; }

        /* Status badges */
        .status {
            display: inline-block;
            padding: 2px 10px;
            border-radius: 999px;
            font-size: 12px;
            font-weight: 600;
        }
        .status-open        { background: #dbeafe; color: #1d4ed8; }
        .status-in-progress { background: #fef3c7; color: #b45309; }
        .status-resolved    { background: #dcfce7; color: #15803d; }
        .status-closed      { background: #f1f5f9; color: #475569; }

        .divider {
            border: none;
            border-top: 1px solid #e2e8f0;
            margin: 16px 0;
        }

        .description-box {
            background: #fff;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 12px 16px;
            font-size: 14px;
            color: #475569;
            line-height: 1.6;
        }

        /* ── Technician section (only shown to client) ── */
        .technician-card {
            background: #eff6ff;
            border: 1px solid #bfdbfe;
            border-radius: 10px;
            padding: 16px 20px;
            margin-bottom: 28px;
            display: flex;
            align-items: center;
            gap: 14px;
        }

        .tech-avatar {
            width: 44px;
            height: 44px;
            background: #1e40af;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            font-weight: 700;
            color: #fff;
            flex-shrink: 0;
        }

        .tech-info .tech-label {
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #3b82f6;
            margin-bottom: 2px;
        }

        .tech-info .tech-name {
            font-size: 15px;
            font-weight: 600;
            color: #1e293b;
        }

        /* ── CTA ── */
        .cta-wrap {
            text-align: center;
            margin-bottom: 28px;
        }

        .cta-btn {
            display: inline-block;
            background: linear-gradient(135deg, #1e40af, #3b82f6);
            color: #ffffff !important;
            text-decoration: none;
            padding: 12px 32px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            letter-spacing: 0.3px;
        }

        /* ── Footer ── */
        .footer {
            background: #f8fafc;
            border-top: 1px solid #e2e8f0;
            padding: 20px 40px;
            text-align: center;
        }

        .footer p {
            font-size: 12px;
            color: #94a3b8;
            line-height: 1.6;
        }

        .footer .brand {
            font-weight: 600;
            color: #64748b;
        }
    </style>
</head>
<body>
<div class="wrapper">

    {{-- ── Header ── --}}
    <div class="header">
        <div class="logo-text">{{ config('app.name') }}</div>
        <div class="logo-sub">Support Ticket System</div>
    </div>

    {{-- ── Role Badge ── --}}
    <div class="badge-wrap">
        @if($mailType === 'technician')
            <span class="badge badge-technician">🔧 Technician Assignment</span>
        @elseif($mailType === 'admin')
            <span class="badge badge-admin">🎫 New Ticket Submitted</span>
        @else
            <span class="badge badge-client">✅ Ticket Update</span>
        @endif
    </div>

    {{-- ── Body ── --}}
    <div class="body">

        <p class="greeting">Hello, {{ $recipient->name }}!</p>

        <p class="intro">
            @if($mailType === 'technician')
                A new support ticket has been assigned to you. Please review the details below and begin working on it at your earliest convenience.
            @elseif($mailType === 'admin')
                A new support ticket has been submitted. Here is a full summary for your records.
            @else
                Your support ticket has been updated. Here's a summary of the current status and assigned technician for your reference.
            @endif
        </p>

        {{-- ── Ticket Card ── --}}
        <div class="ticket-card">
            <div class="ticket-card-header">
                <span class="ticket-id">{{ $ticket->ticket_id }}</span>
                <span class="created-at">{{ $ticket->created_at->format('d M Y, h:i A') }}</span>
            </div>
            <div class="ticket-card-body">
                <div class="info-grid">

                    <div class="info-item">
                        <span class="info-label">Client Name</span>
                        <span class="info-value">{{ $ticket->client_name }}</span>
                    </div>

                    <div class="info-item">
                        <span class="info-label">Email</span>
                        <span class="info-value">{{ $ticket->email ?? '—' }}</span>
                    </div>

                    <div class="info-item">
                        <span class="info-label">Issue Type</span>
                        <span class="info-value">{{ $ticket->issue_type }}</span>
                    </div>

                    <div class="info-item">
                        <span class="info-label">Device Type</span>
                        <span class="info-value">{{ $ticket->device_type }}</span>
                    </div>

                    <div class="info-item">
                        <span class="info-label">Priority</span>
                        <span class="info-value">
                            @php $p = strtolower($ticket->priority); @endphp
                            <span class="priority priority-{{ $p }}">{{ ucfirst($ticket->priority) }}</span>
                        </span>
                    </div>

                    <div class="info-item">
                        <span class="info-label">Status</span>
                        <span class="info-value">
                            @php $s = strtolower(str_replace(' ', '-', $ticket->status)); @endphp
                            <span class="status status-{{ $s }}">{{ ucfirst($ticket->status) }}</span>
                        </span>
                    </div>

                </div>

                <hr class="divider">

                <div class="info-item full-width">
                    <span class="info-label">Problem Description</span>
                    <div class="description-box">{{ $ticket->problem_description }}</div>
                </div>

            </div>
        </div>

        {{-- ── Assigned Technician (shown to client) ── --}}
        @if(in_array($mailType, ['client', 'admin']) && $ticket->assignedUser)
        <div class="technician-card">
            <div class="tech-avatar">
                {{ strtoupper(substr($ticket->assignedUser->name, 0, 1)) }}
            </div>
            <div class="tech-info">
                <div class="tech-label">Assigned Technician</div>
                <div class="tech-name">{{ $ticket->assignedUser->name }}</div>
            </div>
        </div>
        @endif

        {{-- ── CTA ── --}}
        <div class="cta-wrap">
            <a href="{{ config('app.url') }}" class="cta-btn">
                @if($mailType === 'technician')
                    View Ticket Dashboard
                @else
                    Track Your Ticket
                @endif
            </a>
        </div>

    </div>

    {{-- ── Footer ── --}}
    <div class="footer">
        <p>This is an automated notification from <span class="brand">{{ config('app.name') }}</span>.</p>
        <p>Please do not reply directly to this email.</p>
    </div>

</div>
</body>
</html>