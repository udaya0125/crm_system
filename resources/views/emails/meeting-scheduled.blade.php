<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
    <title>Lead Notification</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
    <style>
        body, table, td { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { border: 0; line-height: 100%; outline: none; text-decoration: none; }
        body { margin: 0; padding: 0; width: 100% !important; background-color: #eef2f6; }

        @media only screen and (max-width: 600px) {
            .email-container { width: 100% !important; }
            .stack-col { display: block !important; width: 100% !important; padding-right: 0 !important; padding-bottom: 14px !important; }
            .px-pad { padding-left: 20px !important; padding-right: 20px !important; }
        }

        /* ReactQuill rich-text output (notes) */
        .notes-content { font-size:14px; color:#475569; line-height:1.6; text-align: left; }
        .notes-content p { margin:0 0 10px; }
        .notes-content p:last-child { margin-bottom:0; }
        .notes-content ul, .notes-content ol { margin:0 0 10px; padding-left:20px; }
        .notes-content ul:last-child, .notes-content ol:last-child { margin-bottom:0; }
        .notes-content ul li { list-style-type: disc; margin-bottom:4px; }
        .notes-content ol li { list-style-type: decimal; margin-bottom:4px; }
        .notes-content ul ul li, .notes-content ol ul li { list-style-type: circle; }
        .notes-content strong, .notes-content b { font-weight:700; }
        .notes-content em, .notes-content i { font-style:italic; }
        .notes-content u { text-decoration:underline; }
        .notes-content a { color:#0d77c3; text-decoration:underline; }
        .notes-content blockquote { margin:0 0 10px; padding-left:12px; border-left:3px solid #cbd5e1; color:#64748b; }
    </style>
</head>
<body style="margin:0; padding:0; background-color:#eef2f6; font-family: 'Segoe UI', Arial, sans-serif;">

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#eef2f6;">
    <tr>
        <td align="center" style="padding: 32px 16px;">

            <table role="presentation" class="email-container" width="600" cellpadding="0" cellspacing="0" border="0"
                   style="width:600px; max-width:600px; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 20px rgba(15,23,42,0.08);">

                <!-- Header -->
                <tr>
                    <td align="center" style="background-color:#0d77c3; background-image:linear-gradient(135deg,#0a5c96 0%,#0d77c3 60%,#2196e0 100%); padding:36px 40px;">
                        <div style="font-size:22px; font-weight:700; color:#ffffff; letter-spacing:1px;">
                            {{ config('app.name') }}
                        </div>
                        <div style="font-size:13px; color:#bfe1f7; margin-top:4px;">
                            Lead Management System
                        </div>
                    </td>
                </tr>

                <!-- Badge -->
                <tr>
                    <td align="center" class="px-pad" style="padding:28px 40px 0;">
                        @if($mailType === 'created')
                            <span style="display:inline-block; padding:6px 18px; border-radius:999px; font-size:12px; font-weight:600; letter-spacing:0.5px; text-transform:uppercase; background:#e0f2ff; color:#0d77c3;">
                                &#9679; New Lead Added
                            </span>
                        @else
                            <span style="display:inline-block; padding:6px 18px; border-radius:999px; font-size:12px; font-weight:600; letter-spacing:0.5px; text-transform:uppercase; background:#fef3c7; color:#b45309;">
                                &#8635; Lead Updated
                            </span>
                        @endif
                    </td>
                </tr>

                <!-- Body -->
                <tr>
                    <td class="px-pad" style="padding:24px 40px 36px;">

                        <p style="margin:0 0 10px; font-size:20px; font-weight:600; color:#1e293b; text-align:left;">Hello, Admin!</p>

                        <p style="margin:0 0 26px; font-size:14px; color:#64748b; line-height:1.6; text-align:left;">
                            @if($mailType === 'created')
                                A new lead has been added to the system. Please review the details below and ensure follow-up is scheduled accordingly.
                            @else
                                A lead's follow-up schedule has been updated. Please review the latest details below.
                            @endif
                        </p>

                        <!-- Follow-up Highlight -->
                        @if($lead->next_followup_date)
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
                               style="background-color:#eaf5fd; border:1px solid #a9d8f5; border-radius:10px; margin-bottom:24px;">
                            <tr>
                                <td align="left" style="padding:18px 24px;" width="48">
                                    <span style="font-size:30px; line-height:1;">&#128197;</span>
                                </td>
                                <td align="left" style="padding:18px 24px 18px 0;">
                                    <div style="font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:#0d77c3; margin-bottom:4px;">
                                        Next Follow-up Scheduled
                                    </div>
                                    <div style="font-size:20px; font-weight:700; color:#0a5c96;">
                                        {{ \Carbon\Carbon::parse($lead->next_followup_date)->format('l, d F Y') }}
                                    </div>
                                    <div style="font-size:12px; color:#6b7280; margin-top:2px;">
                                        {{ \Carbon\Carbon::parse($lead->next_followup_date)->diffForHumans() }}
                                    </div>
                                </td>
                            </tr>
                        </table>
                        @endif

                        <!-- Lead Card -->
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
                               style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; overflow:hidden; margin-bottom:28px;">
                            <tr>
                                <td style="background-color:#0d77c3; padding:12px 20px;">
                                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                        <tr>
                                            <td align="left" style="font-size:15px; font-weight:700; color:#ffffff;">
                                                {{ $lead->client_name }}
                                            </td>
                                            <td align="right" style="font-size:12px; color:#cfeaff; white-space:nowrap;">
                                                {{ $lead->created_at->format('d M Y, h:i A') }}
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding:20px;">
                                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">

                                        <tr>
                                            <td class="stack-col" width="50%" valign="top" align="left" style="padding:0 12px 16px 0;">
                                                <div style="font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.5px; color:#94a3b8;">Lead ID</div>
                                                <div style="font-size:14px; color:#1e293b; font-weight:500; margin-top:3px;">
                                                    #{{ $lead->lead_id ?? $lead->id }}
                                                </div>
                                            </td>
                                            <td class="stack-col" width="50%" valign="top" align="left" style="padding:0 0 16px 12px;">
                                                <div style="font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.5px; color:#94a3b8;">Company</div>
                                                <div style="font-size:14px; font-weight:500; margin-top:3px; color:{{ $lead->company_name ? '#1e293b' : '#94a3b8' }}; {{ $lead->company_name ? '' : 'font-style:italic;' }}">
                                                    {{ $lead->company_name ?? 'Not provided' }}
                                                </div>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td class="stack-col" width="50%" valign="top" align="left" style="padding:0 12px 16px 0;">
                                                <div style="font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.5px; color:#94a3b8;">Phone</div>
                                                <div style="font-size:14px; color:#1e293b; font-weight:500; margin-top:3px;">
                                                    {{ $lead->phone }}
                                                </div>
                                            </td>
                                            <td class="stack-col" width="50%" valign="top" align="left" style="padding:0 0 16px 12px;">
                                                <div style="font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.5px; color:#94a3b8;">Email</div>
                                                <div style="font-size:14px; font-weight:500; margin-top:3px; color:{{ $lead->email ? '#1e293b' : '#94a3b8' }}; {{ $lead->email ? '' : 'font-style:italic;' }}">
                                                    {{ $lead->email ?? 'Not provided' }}
                                                </div>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td class="stack-col" width="50%" valign="top" align="left" style="padding:0 12px 16px 0;">
                                                <div style="font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.5px; color:#94a3b8;">Lead Source</div>
                                                <div style="font-size:14px; font-weight:500; margin-top:3px; color:{{ $lead->lead_source ? '#1e293b' : '#94a3b8' }}; {{ $lead->lead_source ? '' : 'font-style:italic;' }}">
                                                    {{ $lead->lead_source ?? 'Not provided' }}
                                                </div>
                                            </td>
                                            <td class="stack-col" width="50%" valign="top" align="left" style="padding:0 0 16px 12px;">
                                                <div style="font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.5px; color:#94a3b8;">Service Interested</div>
                                                <div style="font-size:14px; font-weight:500; margin-top:3px; color:{{ $lead->service_interested ? '#1e293b' : '#94a3b8' }}; {{ $lead->service_interested ? '' : 'font-style:italic;' }}">
                                                    {{ $lead->service_interested ?? 'Not specified' }}
                                                </div>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td class="stack-col" width="50%" valign="top" align="left" style="padding:0 12px 16px 0;">
                                                <div style="font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.5px; color:#94a3b8;">Assigned Salesperson</div>
                                                <div style="font-size:14px; font-weight:500; margin-top:3px; color:{{ $lead->assigned_salesperson ? '#1e293b' : '#94a3b8' }}; {{ $lead->assigned_salesperson ? '' : 'font-style:italic;' }}">
                                                    {{ $lead->assigned_salesperson ?? 'Unassigned' }}
                                                </div>
                                            </td>
                                            <td class="stack-col" width="50%" valign="top" align="left" style="padding:0 0 16px 12px;">
                                                <div style="font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.5px; color:#94a3b8;">Status</div>
                                                <div style="margin-top:4px;">
                                                    @if($lead->status)
                                                        @php
                                                            $statusColors = [
                                                                'new'        => ['bg' => '#dbeafe', 'text' => '#1d4ed8'],
                                                                'contacted'  => ['bg' => '#fef9c3', 'text' => '#ca8a04'],
                                                                'qualified'  => ['bg' => '#dcfce7', 'text' => '#15803d'],
                                                                'lost'       => ['bg' => '#fee2e2', 'text' => '#dc2626'],
                                                                'converted'  => ['bg' => '#ede9fe', 'text' => '#6d28d9'],
                                                            ];
                                                            $key = strtolower(str_replace(' ', '-', $lead->status));
                                                            $sc  = $statusColors[$key] ?? ['bg' => '#e0f2ff', 'text' => '#0d77c3'];
                                                        @endphp
                                                        <span style="display:inline-block; padding:2px 10px; border-radius:999px; font-size:12px; font-weight:600; background:{{ $sc['bg'] }}; color:{{ $sc['text'] }};">
                                                            {{ ucfirst($lead->status) }}
                                                        </span>
                                                    @else
                                                        <span style="color:#94a3b8;">&mdash;</span>
                                                    @endif
                                                </div>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td colspan="2" align="left" style="padding-top:0;">
                                                <div style="font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.5px; color:#94a3b8;">Next Follow-up</div>
                                                <div style="font-size:14px; font-weight:500; margin-top:3px; color:{{ $lead->next_followup_date ? '#1e293b' : '#94a3b8' }}; {{ $lead->next_followup_date ? '' : 'font-style:italic;' }}">
                                                    {{ $lead->next_followup_date
                                                        ? \Carbon\Carbon::parse($lead->next_followup_date)->format('d M Y')
                                                        : 'Not scheduled' }}
                                                </div>
                                            </td>
                                        </tr>

                                        @if($lead->notes)
                                        <tr>
                                            <td colspan="2" style="padding-top:16px;">
                                                <div style="border-top:1px solid #e2e8f0; padding-top:16px;">
                                                    <div style="font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.5px; color:#94a3b8; margin-bottom:8px;">Notes</div>
                                                    <div class="notes-content" style="background:#ffffff; border:1px solid #e2e8f0; border-left:3px solid #0d77c3; border-radius:6px; padding:12px 16px;">
                                                        {!! $lead->notes !!}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        @endif

                                    </table>
                                </td>
                            </tr>
                        </table>

                        <!-- CTA -->
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                                <td align="center" style="padding-bottom:4px;">
                                    <a href="{{ config('app.url') }}"
                                       style="display:inline-block; background-color:#0d77c3; background-image:linear-gradient(135deg,#0a5c96,#0d77c3); color:#ffffff; text-decoration:none; padding:12px 32px; border-radius:8px; font-size:14px; font-weight:600; letter-spacing:0.3px;">
                                        View Lead Dashboard
                                    </a>
                                </td>
                            </tr>
                        </table>

                    </td>
                </tr>

                <!-- Footer -->
                <tr>
                    <td align="center" class="px-pad" style="background:#f8fafc; border-top:1px solid #e2e8f0; padding:20px 40px;">
                        <p style="margin:0; font-size:12px; color:#94a3b8; line-height:1.6;">
                            This is an automated notification from <span style="font-weight:600; color:#64748b;">{{ config('app.name') }}</span>.
                        </p>
                        <p style="margin:0; font-size:12px; color:#94a3b8; line-height:1.6;">
                            Please do not reply directly to this email.
                        </p>
                    </td>
                </tr>

            </table>

        </td>
    </tr>
</table>

</body>
</html>