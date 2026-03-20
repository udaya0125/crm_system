<?php

namespace App\Http\Controllers;

use App\Models\ClientManagement;
use App\Models\UserLog;
use Illuminate\Http\Request;

class ClientManagementController extends Controller
{
    /**
     * Display a listing of clients
     */
    public function index()
    {
        $clients = ClientManagement::with('lead')->latest()->get();

        return response()->json([
            'status' => true,
            'data' => $clients
        ]);
    }

    /**
     * Store a newly created client
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'lead_id'         => 'required|exists:leads,id',
            'company_name'    => 'required|string|max:255',
            'contact_person'  => 'nullable|string|max:255',
            'email'           => 'nullable|email|max:255',
            'phone'           => 'nullable|string|max:20',
            'address'         => 'nullable|string',
            'service_type'    => 'nullable|string|max:255',
            'account_manager' => 'nullable|string|max:255',
            'total_projects'  => 'nullable|integer',
            'total_revenue'   => 'nullable|numeric',
            'payment_status'  => 'nullable|string|max:50',
        ]);

        $client = ClientManagement::create($validated);

        UserLog::create([
            'name'       => $request->user()?->name ?? 'System',
            'ip_address' => $request->ip(),
            'title'      => "Created client management: {$client->company_name}",
        ]);

        return response()->json([
            'status'  => true,
            'message' => 'Client created successfully',
            'data'    => $client
        ]);
    }

    /**
     * Update the specified client
     */
    public function update(Request $request, $id)
    {
        $client = ClientManagement::findOrFail($id);

        $validated = $request->validate([
            'lead_id'         => 'required|exists:leads,id',
            'company_name'    => 'required|string|max:255',
            'contact_person'  => 'nullable|string|max:255',
            'email'           => 'nullable|email|max:255',
            'phone'           => 'nullable|string|max:20',
            'address'         => 'nullable|string',
            'service_type'    => 'nullable|string|max:255',
            'account_manager' => 'nullable|string|max:255',
            'total_projects'  => 'nullable|integer',
            'total_revenue'   => 'nullable|numeric',
            'payment_status'  => 'nullable|string|max:50',
        ]);

        $client->update($validated);

        UserLog::create([
            'name'       => $request->user()?->name ?? 'System',
            'ip_address' => $request->ip(),
            'title'      => "Updated client management: {$client->company_name}",
        ]);

        return response()->json([
            'status'  => true,
            'message' => 'Client updated successfully',
            'data'    => $client
        ]);
    }

    /**
     * Remove the specified client
     */
    public function destroy(Request $request, $id)
    {
        $client = ClientManagement::findOrFail($id);
        $companyName = $client->company_name;
        $client->delete();

        UserLog::create([
            'name'       => $request->user()?->name ?? 'System',
            'ip_address' => $request->ip(),
            'title'      => "Deleted client management: {$companyName}",
        ]);

        return response()->json([
            'status'  => true,
            'message' => 'Client deleted successfully'
        ]);
    }
}