<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\UserLog;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    /**
     * Display a listing of clients
     */
    public function index()
    {
        $clients = Client::latest()->get();

        return response()->json([
            'success' => true,
            'data' => $clients
        ]);
    }

    /**
     * Store a newly created client
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'type'         => 'nullable|string|max:255',
            'name'         => 'required|string|max:255',
            'branchname'   => 'nullable|string|max:255',
            'code'         => 'nullable|string|max:100',
            'pannumber'    => 'nullable|string|max:100',
            'country'      => 'nullable|string|max:100',
            'state'        => 'nullable|string|max:100',
            'city'         => 'nullable|string|max:100',
            'street'       => 'nullable|string|max:255',
            'telone'       => 'nullable|string|max:20',
            'teltwo'       => 'nullable|string|max:20',
            'mobile'       => 'nullable|string|max:20',
            'email'        => 'nullable|email|max:255',
            'website'      => 'nullable|string|max:255',
            'activestatus' => 'nullable|string|max:255',
            'ledgername'   => 'nullable|string|max:255',
        ]);

        $client = Client::create($validated);

        UserLog::create([
            'name'       => $request->user()?->name ?? 'System',
            'ip_address' => $request->ip(),
            'title'      => "Created client: {$client->name}",
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Client created successfully',
            'data'    => $client
        ]);
    }

    /**
     * Update the specified client
     */
    public function update(Request $request, $id)
    {
        $client = Client::findOrFail($id);

        $validated = $request->validate([
            'type'         => 'nullable|string|max:255',
            'name'         => 'required|string|max:255',
            'branchname'   => 'nullable|string|max:255',
            'code'         => 'nullable|string|max:100',
            'pannumber'    => 'nullable|string|max:100',
            'country'      => 'nullable|string|max:100',
            'state'        => 'nullable|string|max:100',
            'city'         => 'nullable|string|max:100',
            'street'       => 'nullable|string|max:255',
            'telone'       => 'nullable|string|max:20',
            'teltwo'       => 'nullable|string|max:20',
            'mobile'       => 'nullable|string|max:20',
            'email'        => 'nullable|email|max:255',
            'website'      => 'nullable|string|max:255',
            'activestatus' => 'nullable|string|max:255',
            'ledgername'   => 'nullable|string|max:255',
        ]);

        $client->update($validated);

        UserLog::create([
            'name'       => $request->user()?->name ?? 'System',
            'ip_address' => $request->ip(),
            'title'      => "Updated client: {$client->name}",
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Client updated successfully',
            'data'    => $client
        ]);
    }

    /**
     * Remove the specified client
     */
    public function destroy(Request $request, $id)
    {
        $client = Client::findOrFail($id);
        $clientName = $client->name;
        $client->delete();

        UserLog::create([
            'name'       => $request->user()?->name ?? 'System',
            'ip_address' => $request->ip(),
            'title'      => "Deleted client: {$clientName}",
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Client deleted successfully'
        ]);
    }
}