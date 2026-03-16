<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Ticket;

class TicketController extends Controller
{
    /**
     * Display all tickets with technician names
     */
    public function index()
    {
        // Eager load the assignedUser relationship
        $tickets = Ticket::with('assignedUser')->latest()->get();

        // Transform tickets to include technician name
        $transformedTickets = $tickets->map(function($ticket) {
            return [
                'id' => $ticket->id,
                'ticket_id' => $ticket->ticket_id,
                'client_name' => $ticket->client_name,
                'issue_type' => $ticket->issue_type,
                'device_type' => $ticket->device_type,
                'problem_description' => $ticket->problem_description,
                'priority' => $ticket->priority,
                'assigned_technician' => $ticket->assigned_technician,
                'technician_name' => $ticket->assignedUser ? $ticket->assignedUser->name : null,
                'status' => $ticket->status,
                'created_at' => $ticket->created_at,
                'updated_at' => $ticket->updated_at
            ];
        });

        return response()->json([
            'status' => true,
            'data' => $transformedTickets
        ]);
    }

    /**
     * Store new ticket
     */
    public function store(Request $request)
    {
        $request->validate([
            'client_name' => 'required|string|max:255',
            'issue_type' => 'required|string|max:255',
            'device_type' => 'required|string|max:255',
            'problem_description' => 'required|string',
            'priority' => 'required|string',
            'assigned_technician' => 'nullable|exists:users,id',
            'status' => 'required|string'
        ]);

        $ticket = Ticket::create([
            'client_name' => $request->client_name,
            'issue_type' => $request->issue_type,
            'device_type' => $request->device_type,
            'problem_description' => $request->problem_description,
            'priority' => $request->priority,
            'assigned_technician' => $request->assigned_technician,
            'status' => $request->status
        ]);

        // Load the assignedUser relationship for the response
        $ticket->load('assignedUser');

        return response()->json([
            'status' => true,
            'message' => 'Ticket created successfully',
            'data' => [
                'id' => $ticket->id,
                'ticket_id' => $ticket->ticket_id,
                'client_name' => $ticket->client_name,
                'issue_type' => $ticket->issue_type,
                'device_type' => $ticket->device_type,
                'problem_description' => $ticket->problem_description,
                'priority' => $ticket->priority,
                'assigned_technician' => $ticket->assigned_technician,
                'technician_name' => $ticket->assignedUser ? $ticket->assignedUser->name : null,
                'status' => $ticket->status,
                'created_at' => $ticket->created_at,
                'updated_at' => $ticket->updated_at
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
            'client_name' => 'sometimes|string|max:255',
            'issue_type' => 'sometimes|string|max:255',
            'device_type' => 'sometimes|string|max:255',
            'problem_description' => 'sometimes|string',
            'priority' => 'sometimes|string',
            'assigned_technician' => 'nullable|exists:users,id',
            'status' => 'sometimes|string'
        ]);

        $ticket->update($request->all());
        
        // Load the assignedUser relationship
        $ticket->load('assignedUser');

        return response()->json([
            'status' => true,
            'message' => 'Ticket updated successfully',
            'data' => [
                'id' => $ticket->id,
                'ticket_id' => $ticket->ticket_id,
                'client_name' => $ticket->client_name,
                'issue_type' => $ticket->issue_type,
                'device_type' => $ticket->device_type,
                'problem_description' => $ticket->problem_description,
                'priority' => $ticket->priority,
                'assigned_technician' => $ticket->assigned_technician,
                'technician_name' => $ticket->assignedUser ? $ticket->assignedUser->name : null,
                'status' => $ticket->status,
                'created_at' => $ticket->created_at,
                'updated_at' => $ticket->updated_at
            ]
        ]);
    }

    /**
     * Delete ticket
     */
    public function destroy($id)
    {
        $ticket = Ticket::findOrFail($id);
        $ticket->delete();

        return response()->json([
            'status' => true,
            'message' => 'Ticket deleted successfully'
        ]);
    }
}