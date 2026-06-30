<?php

namespace App\Services;

use App\Mail\TicketStatusMail;
use App\Models\Ticket;
use App\Models\User;
use App\Models\UserLog;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;

class TicketService
{
    /**
     * Verify reCAPTCHA token with Google.
     * Returns true if valid, false otherwise.
     */
    public function verifyRecaptcha(string $token, string $ipAddress): bool
    {
        try {
            $response = Http::asForm()->post('https://www.google.com/recaptcha/api/siteverify', [
                'secret' => env('RECAPTCHA_SECRET_KEY'),
                'response' => $token,
                'remoteip' => $ipAddress,
            ]);

            Log::info('reCAPTCHA response', $response->json());

            if ($response->json('success') === true) {
                return true;
            }

            Log::warning('reCAPTCHA verification rejected by Google.', [
                'error_codes' => $response->json('error-codes', []),
                'hostname' => $response->json('hostname'),
            ]);

            return false;
        } catch (\Exception $e) {
            Log::error('reCAPTCHA verification failed: '.$e->getMessage());

            return false;
        }
    }

    public function createTicket(array $data, ?string $userName, string $ipAddress): Ticket
    {
        if (isset($data['image']) && $data['image']) {
            $data['image'] = $data['image']->store('tickets', 'public');
        }

        // Remove recaptcha_token before saving to DB
        unset($data['recaptcha_token']);

        $ticket = Ticket::create($data);

        $ticket->load('assignedUser');

        $this->sendClientMail($ticket);
        $this->sendTechnicianMail($ticket);
        $this->sendDepartmentMail($ticket);

        UserLog::create([
            'name' => $userName ?? 'System',
            'ip_address' => $ipAddress,
            'title' => "Created ticket: {$ticket->ticket_id} for {$ticket->client_name}",
        ]);

        return $ticket;
    }

    public function updateTicket(
        Ticket $ticket,
        array $data,
        ?string $userName,
        string $ipAddress
    ): Ticket {
        $previousTechnicianId = $ticket->assigned_technician;
        $previousStatus = $ticket->status;

        if (isset($data['image']) && $data['image']) {
            if (
                $ticket->image &&
                Storage::disk('public')->exists($ticket->image)
            ) {
                Storage::disk('public')->delete($ticket->image);
            }

            $data['image'] = $data['image']->store('tickets', 'public');
        }

        $ticket->update($data);

        $ticket->load('assignedUser');

        $technicianChanged =
            isset($data['assigned_technician']) &&
            (string) $data['assigned_technician'] !==
            (string) $previousTechnicianId;

        $statusChanged =
            isset($data['status']) &&
            $data['status'] !== $previousStatus;

        if ($statusChanged || $technicianChanged) {
            $this->sendClientMail($ticket);
        }

        if ($technicianChanged && $ticket->assignedUser) {
            $this->sendTechnicianMail($ticket);
        }

        UserLog::create([
            'name' => $userName ?? 'System',
            'ip_address' => $ipAddress,
            'title' => "Updated ticket: {$ticket->ticket_id} for {$ticket->client_name}",
        ]);

        return $ticket;
    }

    public function deleteTicket(
        Ticket $ticket,
        ?string $userName,
        string $ipAddress
    ): void {
        $ticketId = $ticket->ticket_id;
        $clientName = $ticket->client_name;

        if (
            $ticket->image &&
            Storage::disk('public')->exists($ticket->image)
        ) {
            Storage::disk('public')->delete($ticket->image);
        }

        $ticket->delete();

        UserLog::create([
            'name' => $userName ?? 'System',
            'ip_address' => $ipAddress,
            'title' => "Deleted ticket: {$ticketId} for {$clientName}",
        ]);
    }

    public function formatTicket(Ticket $ticket): array
    {
        return [
            'id' => $ticket->id,
            'ticket_id' => $ticket->ticket_id,
            'client_name' => $ticket->client_name,
            'issue_type' => $ticket->issue_type,
            'device_type' => $ticket->device_type,
            'problem_description' => $ticket->problem_description,
            'priority' => $ticket->priority,
            'email' => $ticket->email,
            'image' => $ticket->image
                ? asset('storage/'.$ticket->image)
                : null,
            'assigned_technician' => $ticket->assigned_technician,
            'technician_name' => $ticket->assignedUser?->name,
            'status' => $ticket->status,
            'created_at' => $ticket->created_at,
            'updated_at' => $ticket->updated_at,
        ];
    }

    /**
     * Resolve which category group an issue_type belongs to.
     * Returns null if no match is found.
     */
    private function getCategoryGroup(string $issueType): ?string
    {
        foreach (config('tickets.groups', []) as $groupName => $groupData) {
            if (in_array($issueType, $groupData['items'] ?? [], true)) {
                return $groupName;
            }
        }

        return null;
    }

    /**
     * Resolve the email address that should receive tickets for a given
     * issue_type, based on its category group. Falls back to the
     * configured fallback_email (ADMIN_EMAIL) if no group matches or the
     * group has no email configured.
     */
    private function getCategoryEmail(string $issueType): ?string
    {
        $group = $this->getCategoryGroup($issueType);

        if ($group && ! empty(config("tickets.groups.{$group}.email"))) {
            return config("tickets.groups.{$group}.email");
        }

        return config('tickets.fallback_email');
    }

    private function sendClientMail(Ticket $ticket): void
    {
        if (empty($ticket->email)) {
            return;
        }

        try {
            $recipient = new User;
            $recipient->name = $ticket->client_name;

            Mail::to($ticket->email)
                ->send(new TicketStatusMail($ticket, $recipient, 'client'));
        } catch (\Exception $e) {
            Log::error("Client mail failed for {$ticket->ticket_id}: ".$e->getMessage());
        }
    }

    /**
     * Send the new-ticket notification to the department/category email
     * resolved from the ticket's issue_type (e.g. "Digital Marketing" ->
     * digital@yourdomain.com). Falls back to ADMIN_EMAIL if no category
     * email is configured.
     */
    // private function sendDepartmentMail(Ticket $ticket): void
    // {
    //     $email = $this->getCategoryEmail($ticket->issue_type);

    //     Log::info('DEBUG sendDepartmentMail', [
    //         'issue_type' => $ticket->issue_type,
    //         'resolved_email' => $email,
    //     ]);

    //     if (empty($email)) {
    //         Log::warning("No department/admin email resolved for issue_type '{$ticket->issue_type}' on ticket {$ticket->ticket_id}.");

    //         return;
    //     }

    //     // Support comma-separated emails in config/env, same pattern as ADMIN_EMAIL
    //     $recipients = array_filter(array_map('trim', explode(',', $email)));

    //     if (empty($recipients)) {
    //         return;
    //     }

    //     try {
    //         $recipient = new User;
    //         $recipient->name = $this->getCategoryGroup($ticket->issue_type) ?? 'Admin';

    //         Mail::to($recipients)
    //             ->send(new TicketStatusMail($ticket, $recipient, 'admin'));
    //     } catch (\Exception $e) {
    //         Log::error("Department mail failed for {$ticket->ticket_id}: ".$e->getMessage());
    //     }
    // }

    private function sendDepartmentMail(Ticket $ticket): void
    {
        $email = $this->getCategoryEmail($ticket->issue_type);

        Log::info('DEBUG sendDepartmentMail', [
            'issue_type' => $ticket->issue_type,
            'resolved_email' => $email,
        ]);

        if (empty($email)) {
            Log::warning("No department/admin email resolved for issue_type '{$ticket->issue_type}' on ticket {$ticket->ticket_id}.");

            return;
        }

        $recipients = array_filter(array_map('trim', explode(',', $email)));

        if (empty($recipients)) {
            return;
        }

        try {
            $recipient = new User;
            $recipient->name = $this->getCategoryGroup($ticket->issue_type) ?? 'Admin';

            Mail::to($recipients)
                ->send(new TicketStatusMail($ticket, $recipient, 'admin'));
        } catch (\Exception $e) {
            Log::error("Department mail failed for {$ticket->ticket_id}: ".$e->getMessage());
        }
    }

    private function sendTechnicianMail(Ticket $ticket): void
    {
        if (! $ticket->assignedUser || empty($ticket->assignedUser->email)) {
            return;
        }

        try {
            Mail::to($ticket->assignedUser->email)
                ->send(new TicketStatusMail($ticket, $ticket->assignedUser, 'technician'));
        } catch (\Exception $e) {
            Log::error("Technician mail failed for {$ticket->ticket_id}: ".$e->getMessage());
        }
    }
}
