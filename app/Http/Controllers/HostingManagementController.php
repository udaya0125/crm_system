<?php

namespace App\Http\Controllers;

use App\Models\HostingManagement;
use Illuminate\Http\Request;

class HostingManagementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $hostings = HostingManagement::with('client')->latest()->get();

        return response()->json([
            'status' => true,
            'data' => $hostings
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'hosting_plan' => 'required|string|max:255',
            'client_id' => 'required|exists:clients,id',
            'disk_usage' => 'nullable|string|max:255',
            'renewal_date' => 'required|date',
            'hosting_provider' => 'required|string|max:255',
        ]);

        $hosting = HostingManagement::create($request->all());

        return response()->json([
            'status' => true,
            'message' => 'Hosting created successfully',
            'data' => $hosting
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $hosting = HostingManagement::findOrFail($id);

        $request->validate([
            'hosting_plan' => 'required|string|max:255',
            'client_id' => 'required|exists:clients,id',
            'disk_usage' => 'nullable|string|max:255',
            'renewal_date' => 'required|date',
            'hosting_provider' => 'required|string|max:255',
        ]);

        $hosting->update($request->all());

        return response()->json([
            'status' => true,
            'message' => 'Hosting updated successfully',
            'data' => $hosting
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $hosting = HostingManagement::findOrFail($id);
        $hosting->delete();

        return response()->json([
            'status' => true,
            'message' => 'Hosting deleted successfully'
        ]);
    }
}