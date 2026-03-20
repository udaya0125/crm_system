<?php

namespace App\Http\Controllers;

use App\Models\Lead;
use App\Models\UserLog;
use Illuminate\Http\Request;

class LeadController extends Controller
{
    /**
     * Display a listing of leads
     */
    public function index()
    {
        $leads = Lead::latest()->get();

        return response()->json([
            'success' => true,
            'data' => $leads
        ]);
    }

    /**
     * Store a newly created lead
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_name'         => 'required|string|max:255',
            'company_name'        => 'nullable|string|max:255',
            'phone'               => 'required|string|max:20',
            'email'               => 'nullable|email|max:255',
            'service_interested'  => 'nullable|string|max:255',
            'lead_source'         => 'nullable|string|max:255',
            'assigned_salesperson'=> 'nullable|string|max:255',
            'next_followup_date'  => 'nullable|date',
            'notes'               => 'nullable|string',
            'status'              => 'nullable|string|max:100',
        ]);

        $lead = Lead::create($validated);

        UserLog::create([
            'name'       => $request->user()?->name ?? 'System',
            'ip_address' => $request->ip(),
            'title'      => "Created lead: {$lead->client_name}",
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Lead created successfully',
            'data'    => $lead
        ], 201);
    }

    /**
     * Update the specified lead
     */
    public function update(Request $request, $id)
    {
        $lead = Lead::findOrFail($id);

        $validated = $request->validate([
            'client_name'         => 'sometimes|required|string|max:255',
            'company_name'        => 'nullable|string|max:255',
            'phone'               => 'sometimes|required|string|max:20',
            'email'               => 'nullable|email|max:255',
            'service_interested'  => 'nullable|string|max:255',
            'lead_source'         => 'nullable|string|max:255',
            'assigned_salesperson'=> 'nullable|string|max:255',
            'next_followup_date'  => 'nullable|date',
            'notes'               => 'nullable|string',
            'status'              => 'nullable|string|max:100',
        ]);

        $lead->update($validated);

        UserLog::create([
            'name'       => $request->user()?->name ?? 'System',
            'ip_address' => $request->ip(),
            'title'      => "Updated lead: {$lead->client_name}",
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Lead updated successfully',
            'data'    => $lead
        ]);
    }

    /**
     * Remove the specified lead
     */
    public function destroy(Request $request, $id)
    {
        $lead = Lead::findOrFail($id);
        $clientName = $lead->client_name;
        $lead->delete();

        UserLog::create([
            'name'       => $request->user()?->name ?? 'System',
            'ip_address' => $request->ip(),
            'title'      => "Deleted lead: {$clientName}",
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Lead deleted successfully'
        ]);
    }
}