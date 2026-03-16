<?php

namespace App\Http\Controllers;

use App\Models\DomainManagement;
use Illuminate\Http\Request;

class DomainManagementController extends Controller
{
    // Display all domains
    public function index()
    {
        $domains = DomainManagement::with('client')->latest()->get();

        return response()->json([
            'status' => true,
            'data' => $domains
        ]);
    }

    // Store new domain
    public function store(Request $request)
    {
        $request->validate([
            'domain_name' => 'required|string|max:255',
            'client_id' => 'required|exists:clients,id',
            'register' => 'required|string|max:255',
            'purchase_date' => 'required|date',
            'expiry_date' => 'required|date',
            'auto_renewal_status' => 'required|string',
            'dns_provider' => 'nullable|string|max:255',
        ]);

        $domain = DomainManagement::create($request->all());

        return response()->json([
            'status' => true,
            'message' => 'Domain created successfully',
            'data' => $domain
        ]);
    }

    // Update domain
    public function update(Request $request, $id)
    {
        $domain = DomainManagement::findOrFail($id);

        $request->validate([
            'domain_name' => 'required|string|max:255',
            'client_id' => 'required|exists:clients,id',
            'register' => 'required|string|max:255',
            'purchase_date' => 'required|date',
            'expiry_date' => 'required|date',
            'auto_renewal_status' => 'required|string',
            'dns_provider' => 'nullable|string|max:255',
        ]);

        $domain->update($request->all());

        return response()->json([
            'status' => true,
            'message' => 'Domain updated successfully',
            'data' => $domain
        ]);
    }

    // Delete domain
    public function destroy($id)
    {
        $domain = DomainManagement::findOrFail($id);

        $domain->delete();

        return response()->json([
            'status' => true,
            'message' => 'Domain deleted successfully'
        ]);
    }
}