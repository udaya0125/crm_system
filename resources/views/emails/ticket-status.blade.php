<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<title>Ticket Notification</title>
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
    /* Progressive enhancement only — every element below also carries the
       equivalent inline style, so clients that strip <style> (Gmail app,
       many mobile clients, etc.) still render correctly from inline CSS. */
    body, table, td { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { border: 0; line-height: 100%; outline: none; text-decoration: none; }
    body { margin: 0; padding: 0; width: 100% !important; background-color: #f0f4f8; }

    a.cta-btn:hover { opacity: 0.92; }

    @media only screen and (max-width: 600px) {
        .email-container { width: 100% !important; }
        .stack-col { display: block !important; width: 100% !important; padding-left: 0 !important; padding-right: 0 !important; }
        .stack-col + .stack-col { padding-top: 14px !important; }
        .mobile-pad { padding-left: 20px !important; padding-right: 20px !important; }
        .cta-btn-td { width: 100% !important; }
        .cta-btn { display: block !important; width: 100% !important; }
    }
</style>
</head>
<body style="margin:0; padding:0; background-color:#f0f4f8;">
<!-- Preheader (hidden) -->
<div style="display:none; max-height:0; overflow:hidden; mso-hide:all;">
    Ticket {{ $ticket->ticket_id }} — {{ ucfirst($ticket->status) }}
</div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f0f4f8;">
    <tr>
        <td align="center" style="padding:32px 16px;">

            <table role="presentation" class="email-container" width="620" cellpadding="0" cellspacing="0" border="0" style="width:620px; max-width:620px; background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,0.08);">

                {{-- ── Header ── --}}
                <tr>
                    <td align="center" bgcolor="#1e40af" style="background-color:#1e40af; background-image:linear-gradient(135deg,#1e40af 0%,#3b82f6 100%); padding:32px 40px;">
                        <div style="font-family:'Segoe UI',Arial,sans-serif; font-size:20px; font-weight:700; color:#ffffff; letter-spacing:1px;">
                            Support Ticket System
                        </div>
                    </td>
                </tr>

                {{-- ── Role Badge ── --}}
                <tr>
                    <td align="center" style="padding:24px 40px 0;">
                        @if($mailType === 'technician')
                            <span style="display:inline-block; font-family:'Segoe UI',Arial,sans-serif; padding:6px 18px; border-radius:999px; font-size:12px; font-weight:600; letter-spacing:0.5px; text-transform:uppercase; background-color:#dbeafe; color:#1d4ed8; white-space:nowrap;">🔧 Technician Assignment</span>
                        @elseif($mailType === 'admin')
                            <span style="display:inline-block; font-family:'Segoe UI',Arial,sans-serif; padding:6px 18px; border-radius:999px; font-size:12px; font-weight:600; letter-spacing:0.5px; text-transform:uppercase; background-color:#fef3c7; color:#b45309; white-space:nowrap;">🎫 New Ticket Submitted</span>
                        @else
                            <span style="display:inline-block; font-family:'Segoe UI',Arial,sans-serif; padding:6px 18px; border-radius:999px; font-size:12px; font-weight:600; letter-spacing:0.5px; text-transform:uppercase; background-color:#dcfce7; color:#15803d; white-space:nowrap;">✅ Ticket Update</span>
                        @endif
                    </td>
                </tr>

                {{-- ── Body ── --}}
                <tr>
                    <td class="mobile-pad" style="padding:24px 40px 36px;">

                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                                <td style="font-family:'Segoe UI',Arial,sans-serif; font-size:20px; font-weight:600; color:#1e293b; padding-bottom:8px;">
                                    Hello, {{ $recipient->name }}!
                                </td>
                            </tr>
                            <tr>
                                <td style="font-family:'Segoe UI',Arial,sans-serif; font-size:14px; color:#64748b; line-height:1.6; padding-bottom:24px;">
                                    @if($mailType === 'technician')
                                        A new support ticket has been assigned to you. Please review the details below and begin working on it at your earliest convenience.
                                    @elseif($mailType === 'admin')
                                        A new support ticket has been submitted. Here is a full summary for your records.
                                    @else
                                        Your support ticket has been updated. Here's a summary of the current status and assigned technician for your reference.
                                    @endif
                                </td>
                            </tr>
                        </table>

                        {{-- ── Ticket Card ── --}}
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; overflow:hidden; margin-bottom:24px;">
                            <tr>
                                <td bgcolor="#1e40af" style="background-color:#1e40af; padding:14px 20px;">
                                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                        <tr>
                                            <td align="left" style="font-family:'Segoe UI',Arial,sans-serif; font-size:15px; font-weight:700; color:#ffffff; letter-spacing:0.5px;">
                                                {{ $ticket->ticket_id }}
                                            </td>
                                            <td align="right" style="font-family:'Segoe UI',Arial,sans-serif; font-size:12px; color:#bfdbfe; white-space:nowrap;">
                                                {{ $ticket->created_at->format('d M Y, h:i A') }}
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding:20px;">

                                    {{-- Info grid: real table columns so labels/values always
                                         stack correctly regardless of client CSS support --}}
                                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                        <tr>
                                            <td class="stack-col" width="50%" valign="top" style="padding:0 10px 16px 0;">
                                                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                                    <tr><td style="font-family:'Segoe UI',Arial,sans-serif; font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.5px; color:#94a3b8; padding-bottom:4px;">Client Name</td></tr>
                                                    <tr><td style="font-family:'Segoe UI',Arial,sans-serif; font-size:14px; color:#1e293b; font-weight:500; word-break:break-word;">{{ $ticket->client_name }}</td></tr>
                                                </table>
                                            </td>
                                            <td class="stack-col" width="50%" valign="top" style="padding:0 0 16px 10px;">
                                                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                                    <tr><td style="font-family:'Segoe UI',Arial,sans-serif; font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.5px; color:#94a3b8; padding-bottom:4px;">Email</td></tr>
                                                    <tr><td style="font-family:'Segoe UI',Arial,sans-serif; font-size:14px; color:#1e293b; font-weight:500; word-break:break-word;">{{ $ticket->email ?? '—' }}</td></tr>
                                                </table>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="stack-col" width="50%" valign="top" style="padding:0 10px 16px 0;">
                                                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                                    <tr><td style="font-family:'Segoe UI',Arial,sans-serif; font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.5px; color:#94a3b8; padding-bottom:4px;">Category</td></tr>
                                                    <tr><td style="font-family:'Segoe UI',Arial,sans-serif; font-size:14px; color:#1e293b; font-weight:500; word-break:break-word;">{{ $ticket->issue_type }}</td></tr>
                                                </table>
                                            </td>
                                            <td class="stack-col" width="50%" valign="top" style="padding:0 0 16px 10px;">
                                                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                                    <tr><td style="font-family:'Segoe UI',Arial,sans-serif; font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.5px; color:#94a3b8; padding-bottom:4px;">Subject</td></tr>
                                                    <tr><td style="font-family:'Segoe UI',Arial,sans-serif; font-size:14px; color:#1e293b; font-weight:500; word-break:break-word;">{{ $ticket->device_type }}</td></tr>
                                                </table>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="stack-col" width="50%" valign="top" style="padding:0 10px 0 0;">
                                                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                                    <tr><td style="font-family:'Segoe UI',Arial,sans-serif; font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.5px; color:#94a3b8; padding-bottom:6px;">Priority</td></tr>
                                                    <tr>
                                                        <td>
                                                            @php
                                                                $p = strtolower($ticket->priority);
                                                                $priorityColors = [
                                                                    'low' => ['bg' => '#dcfce7', 'text' => '#16a34a'],
                                                                    'medium' => ['bg' => '#fef9c3', 'text' => '#ca8a04'],
                                                                    'high' => ['bg' => '#fee2e2', 'text' => '#dc2626'],
                                                                    'critical' => ['bg' => '#fce7f3', 'text' => '#9d174d'],
                                                                ];
                                                                $pc = $priorityColors[$p] ?? ['bg' => '#f1f5f9', 'text' => '#475569'];
                                                            @endphp
                                                            <span style="display:inline-block; font-family:'Segoe UI',Arial,sans-serif; padding:3px 10px; border-radius:999px; font-size:12px; font-weight:600; background-color:{{ $pc['bg'] }}; color:{{ $pc['text'] }};">{{ ucfirst($ticket->priority) }}</span>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                            <td class="stack-col" width="50%" valign="top" style="padding:0 0 0 10px;">
                                                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                                    <tr><td style="font-family:'Segoe UI',Arial,sans-serif; font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.5px; color:#94a3b8; padding-bottom:6px;">Status</td></tr>
                                                    <tr>
                                                        <td>
                                                            @php
                                                                $s = strtolower(str_replace(' ', '-', $ticket->status));
                                                                $statusColors = [
                                                                    'open' => ['bg' => '#dbeafe', 'text' => '#1d4ed8'],
                                                                    'in-progress' => ['bg' => '#fef3c7', 'text' => '#b45309'],
                                                                    'resolved' => ['bg' => '#dcfce7', 'text' => '#15803d'],
                                                                    'closed' => ['bg' => '#f1f5f9', 'text' => '#475569'],
                                                                ];
                                                                $sc = $statusColors[$s] ?? ['bg' => '#f1f5f9', 'text' => '#475569'];
                                                            @endphp
                                                            <span style="display:inline-block; font-family:'Segoe UI',Arial,sans-serif; padding:3px 10px; border-radius:999px; font-size:12px; font-weight:600; background-color:{{ $sc['bg'] }}; color:{{ $sc['text'] }};">{{ ucfirst($ticket->status) }}</span>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>

                                    <div style="border-top:1px solid #e2e8f0; margin:20px 0; line-height:0; font-size:0;">&nbsp;</div>

                                    {{-- Problem description: color and wrapping are set inline
                                         (not just in <style>) so clients that ignore <style>
                                         still render plain, correctly-wrapped dark text instead
                                         of falling back to a default link-blue. white-space:pre-line
                                         preserves the user's original line breaks. The box has no
                                         fixed height/overflow, so it always shows the full text
                                         regardless of length. --}}
                                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                        <tr>
                                            <td style="font-family:'Segoe UI',Arial,sans-serif; font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.5px; color:#94a3b8; padding-bottom:6px;">
                                                Problem Description
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="background-color:#ffffff; border:1px solid #e2e8f0; border-radius:8px; padding:14px 16px;">
                                                <div style="font-family:'Segoe UI',Arial,sans-serif; font-size:14px; line-height:1.7; color:#475569 !important; white-space:pre-line; word-wrap:break-word; overflow-wrap:break-word; word-break:break-word;">{{ $ticket->problem_description }}</div>
                                            </td>
                                        </tr>
                                    </table>

                                </td>
                            </tr>
                        </table>

                        {{-- ── Assigned Technician (shown to client/admin) ── --}}
                        @if(in_array($mailType, ['client', 'admin']) && $ticket->assignedUser)
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#eff6ff; border:1px solid #bfdbfe; border-radius:10px; margin-bottom:24px;">
                            <tr>
                                <td style="padding:16px 20px;">
                                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                                        <tr>
                                            <td width="44" valign="middle" style="padding-right:14px;">
                                                <table role="presentation" width="44" height="44" cellpadding="0" cellspacing="0" border="0" style="background-color:#1e40af; border-radius:50%;">
                                                    <tr>
                                                        <td align="center" valign="middle" style="width:44px; height:44px; font-family:'Segoe UI',Arial,sans-serif; font-size:18px; font-weight:700; color:#ffffff;">
                                                            {{ strtoupper(substr($ticket->assignedUser->name, 0, 1)) }}
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                            <td valign="middle">
                                                <div style="font-family:'Segoe UI',Arial,sans-serif; font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.5px; color:#3b82f6; margin-bottom:3px;">Assigned Technician</div>
                                                <div style="font-family:'Segoe UI',Arial,sans-serif; font-size:15px; font-weight:600; color:#1e293b; word-break:break-word;">{{ $ticket->assignedUser->name }}</div>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                        @endif

                    </td>
                </tr>

                {{-- ── Footer ── --}}
                <tr>
                    <td align="center" bgcolor="#f8fafc" style="background-color:#f8fafc; border-top:1px solid #e2e8f0; padding:20px 40px;">
                        <div style="font-family:'Segoe UI',Arial,sans-serif; font-size:12px; color:#94a3b8; line-height:1.6;">
                            This is an automated notification. Please do not reply directly to this email.
                        </div>
                    </td>
                </tr>

            </table>

        </td>
    </tr>
</table>
</body>
</html>