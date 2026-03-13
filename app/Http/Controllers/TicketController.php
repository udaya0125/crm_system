<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Ticket;

class TicketController extends Controller
{
    /**
     * Display all tickets
     */
    public function index()
    {
        $tickets = Ticket::latest()->get();

        return response()->json([
            'status' => true,
            'data' => $tickets
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
            'assigned_technician' => 'nullable|string|max:255',
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

        return response()->json([
            'status' => true,
            'message' => 'Ticket created successfully',
            'data' => $ticket
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
            'assigned_technician' => 'nullable|string|max:255',
            'status' => 'sometimes|string'
        ]);

        $ticket->update($request->all());

        return response()->json([
            'status' => true,
            'message' => 'Ticket updated successfully',
            'data' => $ticket
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