<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Meeting Scheduled</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #4F46E5;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .content {
            background-color: #f9fafb;
            padding: 30px;
            border: 1px solid #e5e7eb;
        }
        .info-row {
            margin-bottom: 15px;
            padding: 10px;
            background-color: white;
            border-left: 4px solid #4F46E5;
            border-radius: 4px;
        }
        .info-label {
            font-weight: bold;
            color: #4F46E5;
            display: inline-block;
            width: 150px;
        }
        .info-value {
            color: #374151;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
        }
        .meeting-type-badge {
            display: inline-block;
            padding: 5px 10px;
            background-color: #10b981;
            color: white;
            border-radius: 4px;
            font-size: 14px;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🗓️ New Meeting Scheduled</h1>
    </div>
    
    <div class="content">
        <p>Hello Admin,</p>
        <p>A new meeting has been scheduled. Here are the details:</p>
        
        <div class="info-row">
            <span class="info-label">Company Name:</span>
            <span class="info-value">{{ $company->company_name }}</span>
        </div>
        
        @if($company->address)
        <div class="info-row">
            <span class="info-label">Company Address:</span>
            <span class="info-value">{{ $company->address }}</span>
        </div>
        @endif
        
        @if($company->client_member)
        <div class="info-row">
            <span class="info-label">Client Member:</span>
            <span class="info-value">{{ $company->client_member }}</span>
        </div>
        @endif
        
        <div class="info-row">
            <span class="info-label">Meeting Date:</span>
            <span class="info-value">{{ \Carbon\Carbon::parse($meeting->meeting_date)->format('l, F j, Y') }}</span>
        </div>
        
        <div class="info-row">
            <span class="info-label">Meeting Time:</span>
            <span class="info-value">{{ \Carbon\Carbon::parse($meeting->meeting_time)->format('g:i A') }}</span>
        </div>
        
        <div class="info-row">
            <span class="info-label">Meeting Type:</span>
            <span class="info-value">
                <span class="meeting-type-badge">{{ ucfirst($meeting->meeting_type) }}</span>
            </span>
        </div>
        
        @if($meeting->meeting_location)
        <div class="info-row">
            <span class="info-label">Location:</span>
            <span class="info-value">{{ $meeting->meeting_location }}</span>
        </div>
        @endif
        
        @if($meeting->phone_details)
        <div class="info-row">
            <span class="info-label">Phone Details:</span>
            <span class="info-value">{{ $meeting->phone_details }}</span>
        </div>
        @endif
        
        @if($meeting->agenda)
        <div class="info-row">
            <span class="info-label">Agenda:</span>
            <span class="info-value">{{ $meeting->agenda }}</span>
        </div>
        @endif
        
        @if($meeting->attendee)
        <div class="info-row">
            <span class="info-label">Attendees:</span>
            <span class="info-value">{{ $meeting->attendee }}</span>
        </div>
        @endif
    </div>
    
    <div class="footer">
        <p>This is an automated notification from your CRM system.</p>
        <p>Please do not reply to this email.</p>
    </div>
</body>
</html>