<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Lead Notification</title>
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
            background: linear-gradient(135deg, #065f46 0%, #10b981 100%);
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
            color: #a7f3d0;
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

        .badge-created { background: #d1fae5; color: #065f46; }
        .badge-updated { background: #fef3c7; color: #b45309; }

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

        /* ── Followup Highlight Box ── */
        .followup-box {
            background: linear-gradient(135deg, #ecfdf5, #d1fae5);
            border: 1px solid #6ee7b7;
            border-radius: 10px;
            padding: 18px 24px;
            margin-bottom: 24px;
            display: flex;
            align-items: center;
            gap: 16px;
        }

        .followup-icon {
            font-size: 32px;
            flex-shrink: 0;
        }

        .followup-content .followup-label {
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #059669;
            margin-bottom: 4px;
        }

        .followup-content .followup-date {
            font-size: 20px;
            font-weight: 700;
            color: #065f46;
        }

        .followup-content .followup-sub {
            font-size: 12px;
            color: #6b7280;
            margin-top: 2px;
        }

        /* ── Lead Card ── */
        .lead-card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            overflow: hidden;
            margin-bottom: 28px;
        }

        .lead-card-header {
            background: #065f46;
            padding: 12px 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .lead-card-header .lead-name {
            font-size: 15px;
            font-weight: 700;
            color: #ffffff;
        }

        .lead-card-header .lead-date {
            font-size: 12px;
            color: #a7f3d0;
        }

        .lead-card-body {
            padding: 20px;
        }

        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
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

        .info-value.muted {
            color: #94a3b8;
            font-style: italic;
        }

        /* Status badges */
        .status {
            display: inline-block;
            padding: 2px 10px;
            border-radius: 999px;
            font-size: 12px;
            font-weight: 600;
        }
        .status-new          { background: #dbeafe; color: #1d4ed8; }
        .status-contacted    { background: #fef9c3; color: #ca8a04; }
        .status-qualified    { background: #d1fae5; color: #065f46; }
        .status-lost         { background: #fee2e2; color: #dc2626; }
        .status-converted    { background: #ede9fe; color: #6d28d9; }

        .divider {
            border: none;
            border-top: 1px solid #e2e8f0;
            margin: 16px 0;
        }

        .notes-box {
            background: #fff;
            border: 1px solid #e2e8f0;
            border-left: 3px solid #10b981;
            border-radius: 6px;
            padding: 12px 16px;
            font-size: 14px;
            color: #475569;
            line-height: 1.6;
        }

        /* ── CTA ── */
        .cta-wrap {
            text-align: center;
            margin-bottom: 28px;
        }

        .cta-btn {
            display: inline-block;
            background: linear-gradient(135deg, #065f46, #10b981);
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
        <div class="logo-sub">Lead Management System</div>
    </div>

    {{-- ── Badge ── --}}
    <div class="badge-wrap">
        @if($mailType === 'created')
            <span class="badge badge-created">🟢 New Lead Added</span>
        @else
            <span class="badge badge-updated">🔄 Lead Updated</span>
        @endif
    </div>

    {{-- ── Body ── --}}
    <div class="body">

        <p class="greeting">Hello, Admin!</p>

        <p class="intro">
            @if($mailType === 'created')
                A new lead has been added to the system. Please review the details below and ensure follow-up is scheduled accordingly.
            @else
                An existing lead has been updated. Below are the latest details including any changes to the follow-up schedule.
            @endif
        </p>

        {{-- ── Follow-up Date Highlight ── --}}
        @if($lead->next_followup_date)
        <div class="followup-box">
            <div class="followup-icon">📅</div>
            <div class="followup-content">
                <div class="followup-label">Next Follow-up Scheduled</div>
                <div class="followup-date">
                    {{ \Carbon\Carbon::parse($lead->next_followup_date)->format('l, d F Y') }}
                </div>
                <div class="followup-sub">
                    {{ \Carbon\Carbon::parse($lead->next_followup_date)->diffForHumans() }}
                </div>
            </div>
        </div>
        @endif

        {{-- ── Lead Details Card ── --}}
        <div class="lead-card">
            <div class="lead-card-header">
                <span class="lead-name">{{ $lead->client_name }}</span>
                <span class="lead-date">{{ $lead->created_at->format('d M Y, h:i A') }}</span>
            </div>
            <div class="lead-card-body">
                <div class="info-grid">

                    <div class="info-item">
                        <span class="info-label">Company</span>
                        <span class="info-value {{ $lead->company_name ? '' : 'muted' }}">
                            {{ $lead->company_name ?? 'Not provided' }}
                        </span>
                    </div>

                    <div class="info-item">
                        <span class="info-label">Phone</span>
                        <span class="info-value">{{ $lead->phone }}</span>
                    </div>

                    <div class="info-item">
                        <span class="info-label">Email</span>
                        <span class="info-value {{ $lead->email ? '' : 'muted' }}">
                            {{ $lead->email ?? 'Not provided' }}
                        </span>
                    </div>

                    <div class="info-item">
                        <span class="info-label">Lead Source</span>
                        <span class="info-value {{ $lead->lead_source ? '' : 'muted' }}">
                            {{ $lead->lead_source ?? 'Not provided' }}
                        </span>
                    </div>

                    <div class="info-item">
                        <span class="info-label">Service Interested</span>
                        <span class="info-value {{ $lead->service_interested ? '' : 'muted' }}">
                            {{ $lead->service_interested ?? 'Not specified' }}
                        </span>
                    </div>

                    <div class="info-item">
                        <span class="info-label">Assigned Salesperson</span>
                        <span class="info-value {{ $lead->assigned_salesperson ? '' : 'muted' }}">
                            {{ $lead->assigned_salesperson ?? 'Unassigned' }}
                        </span>
                    </div>

                    <div class="info-item">
                        <span class="info-label">Status</span>
                        <span class="info-value">
                            @if($lead->status)
                                @php $s = strtolower(str_replace(' ', '-', $lead->status)); @endphp
                                <span class="status status-{{ $s }}">{{ ucfirst($lead->status) }}</span>
                            @else
                                <span class="muted">—</span>
                            @endif
                        </span>
                    </div>

                    <div class="info-item">
                        <span class="info-label">Next Follow-up</span>
                        <span class="info-value {{ $lead->next_followup_date ? '' : 'muted' }}">
                            {{ $lead->next_followup_date
                                ? \Carbon\Carbon::parse($lead->next_followup_date)->format('d M Y')
                                : 'Not scheduled' }}
                        </span>
                    </div>

                </div>

                @if($lead->notes)
                <hr class="divider">
                <div class="info-item full-width">
                    <span class="info-label" style="margin-bottom: 8px; display:block;">Notes</span>
                    <div class="notes-box">{{ $lead->notes }}</div>
                </div>
                @endif

            </div>
        </div>

        {{-- ── CTA ── --}}
        <div class="cta-wrap">
            <a href="{{ config('app.url') }}" class="cta-btn">View Lead Dashboard</a>
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