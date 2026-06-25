<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTicketRequest;
use App\Http\Requests\UpdateTicketRequest;
use App\Models\Ticket;
use App\Services\TicketService;
use Illuminate\Http\Request;

class TicketController extends Controller
{
    protected TicketService $ticketService;

    public function __construct(TicketService $ticketService)
    {
        $this->ticketService = $ticketService;
    }

    /**
     * Display all tickets
     */
    public function index()
    {
        $tickets = Ticket::with('assignedUser')
            ->latest()
            ->get();

        $data = $tickets->map(function ($ticket) {
            return $this->ticketService->formatTicket($ticket);
        });

        return response()->json([
            'status' => true,
            'data' => $data,
        ]);
    }

    /**
     * Store a newly created ticket
     */
    public function store(StoreTicketRequest $request)
    {
        $ticket = $this->ticketService->createTicket(
            $request->validated(),
            $request->user()?->name,
            $request->ip()
        );

        return response()->json([
            'status' => true,
            'message' => 'Ticket created successfully',
            'data' => $this->ticketService->formatTicket($ticket),
        ], 201);
    }

    /**
     * Display single ticket
     */
    public function show($id)
    {
        $ticket = Ticket::with('assignedUser')
            ->findOrFail($id);

        return response()->json([
            'status' => true,
            'data' => $this->ticketService->formatTicket($ticket),
        ]);
    }

    /**
     * Update ticket
     */
    public function update(UpdateTicketRequest $request, $id)
    {
        $ticket = Ticket::findOrFail($id);

        $ticket = $this->ticketService->updateTicket(
            $ticket,
            $request->validated(),
            $request->user()?->name,
            $request->ip()
        );

        return response()->json([
            'status' => true,
            'message' => 'Ticket updated successfully',
            'data' => $this->ticketService->formatTicket($ticket),
        ]);
    }

    /**
     * Delete ticket
     */
    public function destroy(Request $request, $id)
    {
        $ticket = Ticket::findOrFail($id);

        $this->ticketService->deleteTicket(
            $ticket,
            $request->user()?->name,
            $request->ip()
        );

        return response()->json([
            'status' => true,
            'message' => 'Ticket deleted successfully',
        ]);
    }
}
