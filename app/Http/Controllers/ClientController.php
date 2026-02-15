<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    /**
     * Display all clients
     */
    public function index()
    {
        $clients = Client::latest()->get();

        return response()->json([
            'status' => true,
            'data' => $clients
        ]);
    }

    /**
     * Store a new client
     */
    public function store(Request $request)
    {
        $request->validate([
            'organization_name' => 'required|string|max:255',
            'contact_person' => 'required|string|max:255',
            'contact_phone' => 'required|string|max:20',
            'email' => 'nullable|email|max:255',
        ]);

        $client = Client::create($request->all());

        return response()->json([
            'status' => true,
            'message' => 'Client created successfully',
            'data' => $client
        ], 201);
    }

    /**
     * Update client
     */
    public function update(Request $request, $id)
    {
        $client = Client::findOrFail($id);

        $request->validate([
            'organization_name' => 'required|string|max:255',
            'contact_person' => 'required|string|max:255',
            'contact_phone' => 'required|string|max:20',
            'email' => 'nullable|email|max:255',
        ]);

        $client->update($request->all());

        return response()->json([
            'status' => true,
            'message' => 'Client updated successfully',
            'data' => $client
        ]);
    }

    /**
     * Delete client
     */
    public function destroy($id)
    {
        $client = Client::findOrFail($id);
        $client->delete();

        return response()->json([
            'status' => true,
            'message' => 'Client deleted successfully'
        ]);
    }
}
