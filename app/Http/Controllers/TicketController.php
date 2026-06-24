<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Ticket;
use App\Models\User;
use App\Models\UserLog;
use App\Mail\TicketStatusMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class TicketController extends Controller
{
    /**
     * Display all tickets with technician names
     */
    // public function index()
    // {
    //     $tickets = Ticket::with('assignedUser')->latest()->get();

    //     $transformedTickets = $tickets->map(function ($ticket) {
    //         return [
    //             'id'                  => $ticket->id,
    //             'ticket_id'           => $ticket->ticket_id,
    //             'client_name'         => $ticket->client_name,
    //             'issue_type'          => $ticket->issue_type,
    //             'device_type'         => $ticket->device_type,
    //             'problem_description' => $ticket->problem_description,
    //             'priority'            => $ticket->priority,
    //             'email'               => $ticket->email,
    //             'image'               => $ticket->image
    //                 ? asset('storage/' . $ticket->image)
    //                 : null,
    //             'assigned_technician' => $ticket->assigned_technician,
    //             'technician_name'     => $ticket->assignedUser
    //                 ? $ticket->assignedUser->name
    //                 : null,
    //             'status'              => $ticket->status,
    //             'created_at'          => $ticket->created_at,
    //             'updated_at'          => $ticket->updated_at,
    //         ];
    //     });

    //     return response()->json([
    //         'status' => true,
    //         'data'   => $transformedTickets
    //     ]);
    // }

    public function index()
{
    $tickets = Ticket::with('assignedUser')->latest()->get();

    $transformedTickets = $tickets->map(function ($ticket) {
        return [
            'id'                  => $ticket->id,
            'ticket_id'           => $ticket->ticket_id,
            'client_name'         => $ticket->client_name,
            'issue_type'          => $ticket->issue_type,
            'device_type'         => $ticket->device_type,
            'problem_description' => $ticket->problem_description,
            'priority'            => $ticket->priority,
            'email'               => $ticket->email,
            'image'               => $ticket->image ?? null,
            'assigned_technician' => $ticket->assigned_technician,
            'technician_name'     => $ticket->assignedUser
                ? $ticket->assignedUser->name
                : null,
            'status'              => $ticket->status,
            'created_at'          => $ticket->created_at,
            'updated_at'          => $ticket->updated_at,
        ];
    });

    return response()->json([
        'status' => true,
        'data'   => $transformedTickets
    ]);
}

    /**
     * Store new ticket
     */
    public function store(Request $request)
    {
        $request->validate([
            'client_name'         => 'required|string|max:255',
            'issue_type'          => 'required|string|max:255',
            'device_type'         => 'required|string|max:255',
            'problem_description' => 'required|string',
            'priority'            => 'required|string',
            'email'               => 'nullable|email|max:255',
            'image'               => 'nullable|mimes:jpg,jpeg,png,webp,pdf|max:5120',
            'assigned_technician' => 'nullable|exists:users,id',
            'status'              => 'required|string'
        ]);

        $imagePath = null;

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('tickets', 'public');
        }

        $ticket = Ticket::create([
            'client_name'         => $request->client_name,
            'issue_type'          => $request->issue_type,
            'device_type'         => $request->device_type,
            'problem_description' => $request->problem_description,
            'priority'            => $request->priority,
            'email'               => $request->email,
            'image'               => $imagePath,
            'assigned_technician' => $request->assigned_technician,
            'status'              => $request->status
        ]);

        $ticket->load('assignedUser');

        // ── Send confirmation email to client ──────────────────────────────
        $this->sendClientMail($ticket);

        // ── Send assignment email to technician ───────────────────────────
        $this->sendTechnicianMail($ticket);

        // ── Notify admin of new ticket ─────────────────────────────────────
        $this->sendAdminMail($ticket);

        UserLog::create([
            'name'       => $request->user()?->name ?? 'System',
            'ip_address' => $request->ip(),
            'title'      => "Created ticket: {$ticket->ticket_id} for {$ticket->client_name}",
        ]);

        return response()->json([
            'status'  => true,
            'message' => 'Ticket created successfully',
            'data'    => $this->formatTicket($ticket)
        ]);
    }

    /**
     * Update ticket
     */
    public function update(Request $request, $id)
    {
        $ticket = Ticket::findOrFail($id);

        // Track what changed before update
        $previousTechnicianId = $ticket->assigned_technician;
        $previousStatus       = $ticket->status;

        $request->validate([
            'client_name'         => 'sometimes|string|max:255',
            'issue_type'          => 'sometimes|string|max:255',
            'device_type'         => 'sometimes|string|max:255',
            'problem_description' => 'sometimes|string',
            'priority'            => 'sometimes|string',
            'email'               => 'nullable|email|max:255',
            'image'               => 'nullable|mimes:jpg,jpeg,png,webp,pdf|max:5120',
            'assigned_technician' => 'nullable|exists:users,id',
            'status'              => 'sometimes|string'
        ]);

        $data = $request->except('image');

        if ($request->hasFile('image')) {
            if ($ticket->image && Storage::disk('public')->exists($ticket->image)) {
                Storage::disk('public')->delete($ticket->image);
            }
            $data['image'] = $request->file('image')->store('tickets', 'public');
        }

        $ticket->update($data);
        $ticket->load('assignedUser');

        $technicianChanged = $request->has('assigned_technician')
            && (string) $request->assigned_technician !== (string) $previousTechnicianId;

        $statusChanged = $request->has('status')
            && $request->status !== $previousStatus;

        // ── Notify client if status or technician changed ─────────────────
        if ($statusChanged || $technicianChanged) {
            $this->sendClientMail($ticket);
        }

        // ── Notify new technician if they were just assigned ──────────────
        if ($technicianChanged && $ticket->assignedUser) {
            $this->sendTechnicianMail($ticket);
        }

        UserLog::create([
            'name'       => $request->user()?->name ?? 'System',
            'ip_address' => $request->ip(),
            'title'      => "Updated ticket: {$ticket->ticket_id} for {$ticket->client_name}",
        ]);

        return response()->json([
            'status'  => true,
            'message' => 'Ticket updated successfully',
            'data'    => $this->formatTicket($ticket)
        ]);
    }

    /**
     * Delete ticket
     */
    public function destroy(Request $request, $id)
    {
        $ticket = Ticket::findOrFail($id);

        $ticketId   = $ticket->ticket_id;
        $clientName = $ticket->client_name;

        if ($ticket->image && Storage::disk('public')->exists($ticket->image)) {
            Storage::disk('public')->delete($ticket->image);
        }

        $ticket->delete();

        UserLog::create([
            'name'       => $request->user()?->name ?? 'System',
            'ip_address' => $request->ip(),
            'title'      => "Deleted ticket: {$ticketId} for {$clientName}",
        ]);

        return response()->json([
            'status'  => true,
            'message' => 'Ticket deleted successfully'
        ]);
    }

    // ──────────────────────────────────────────────────────────────────────
    // Private Helpers
    // ──────────────────────────────────────────────────────────────────────

    /**
     * Send ticket status update email to the client.
     * Uses the client_name + email fields on the ticket itself.
     */
    private function sendClientMail(Ticket $ticket): void
    {
        if (empty($ticket->email)) {
            return;
        }

        try {
            // Build a lightweight User-like object so the Mailable can use
            // $recipient->name without requiring a real User record for the client.
            $clientRecipient       = new User();
            $clientRecipient->name = $ticket->client_name;

            Mail::to($ticket->email)
                ->send(new TicketStatusMail($ticket, $clientRecipient, 'client'));
        } catch (\Exception $e) {
            Log::error("TicketController: failed to send client mail for {$ticket->ticket_id}: " . $e->getMessage());
        }
    }

    /**
     * Notify admin when a new ticket is created.
     * Reads ADMIN_EMAIL from .env (supports comma-separated multiple addresses).
     */
    private function sendAdminMail(Ticket $ticket): void
    {
        $adminEmails = array_filter(
            array_map('trim', explode(',', env('ADMIN_EMAIL', '')))
        );

        if (empty($adminEmails)) {
            return;
        }

        try {
            $adminRecipient       = new User();
            $adminRecipient->name = 'Admin';

            Mail::to($adminEmails)
                ->send(new TicketStatusMail($ticket, $adminRecipient, 'admin'));
        } catch (\Exception $e) {
            Log::error("TicketController: failed to send admin mail for {$ticket->ticket_id}: " . $e->getMessage());
        }
    }

    /**
     * Send ticket assignment email to the assigned technician.
     */
    private function sendTechnicianMail(Ticket $ticket): void
    {
        if (!$ticket->assignedUser || empty($ticket->assignedUser->email)) {
            return;
        }

        try {
            Mail::to($ticket->assignedUser->email)
                ->send(new TicketStatusMail($ticket, $ticket->assignedUser, 'technician'));
        } catch (\Exception $e) {
            Log::error("TicketController: failed to send technician mail for {$ticket->ticket_id}: " . $e->getMessage());
        }
    }

    /**
     * Shared ticket formatting for JSON responses.
     */
    private function formatTicket(Ticket $ticket): array
    {
        return [
            'id'                  => $ticket->id,
            'ticket_id'           => $ticket->ticket_id,
            'client_name'         => $ticket->client_name,
            'issue_type'          => $ticket->issue_type,
            'device_type'         => $ticket->device_type,
            'problem_description' => $ticket->problem_description,
            'priority'            => $ticket->priority,
            'email'               => $ticket->email,
            'image'               => $ticket->image
                ? asset('storage/' . $ticket->image)
                : null,
            'assigned_technician' => $ticket->assigned_technician,
            'technician_name'     => $ticket->assignedUser
                ? $ticket->assignedUser->name
                : null,
            'status'              => $ticket->status,
            'created_at'          => $ticket->created_at,
            'updated_at'          => $ticket->updated_at,
        ];
    }
}