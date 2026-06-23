<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Ticket;
use App\Models\UserLog;
use Illuminate\Support\Facades\Storage;

class TicketController extends Controller
{
    /**
     * Display all tickets with technician names
     */
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
            'image'               => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
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

        UserLog::create([
            'name'       => $request->user()?->name ?? 'System',
            'ip_address' => $request->ip(),
            'title'      => "Created ticket: {$ticket->ticket_id} for {$ticket->client_name}",
        ]);

        return response()->json([
            'status'  => true,
            'message' => 'Ticket created successfully',
            'data'    => [
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
                'updated_at'          => $ticket->updated_at
            ]
        ]);
    }

    /**
     * Update ticket
     */
    public function update(Request $request, $id)
    {
        $ticket = Ticket::findOrFail($id);

        $request->validate([
            'client_name'         => 'sometimes|string|max:255',
            'issue_type'          => 'sometimes|string|max:255',
            'device_type'         => 'sometimes|string|max:255',
            'problem_description' => 'sometimes|string',
            'priority'            => 'sometimes|string',
            'email'               => 'sometimes|nullable|email|max:255',
            'image'               => 'sometimes|nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
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

        UserLog::create([
            'name'       => $request->user()?->name ?? 'System',
            'ip_address' => $request->ip(),
            'title'      => "Updated ticket: {$ticket->ticket_id} for {$ticket->client_name}",
        ]);

        return response()->json([
            'status'  => true,
            'message' => 'Ticket updated successfully',
            'data'    => [
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
                'updated_at'          => $ticket->updated_at
            ]
        ]);
    }

    /**
     * Delete ticket
     */
    public function destroy(Request $request, $id)
    {
        $ticket = Ticket::findOrFail($id);

        $ticketId = $ticket->ticket_id;
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
}

