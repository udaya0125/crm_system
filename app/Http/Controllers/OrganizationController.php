<?php

namespace App\Http\Controllers;

use App\Models\Organization;
use Illuminate\Http\Request;

class OrganizationController extends Controller
{
    //
        /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $organizations = Organization::latest()->get();

        return response()->json([
            'status' => true,
            'data' => $organizations,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'   => 'required|string|max:255',
            'domain' => 'nullable|string|max:255|unique:organizations,domain',
        ]);

        $organization = Organization::create($validated);

        return response()->json([
            'status' => true,
            'message' => 'Organization created successfully',
            'data' => $organization,
        ], 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $organization = Organization::findOrFail($id);

        $validated = $request->validate([
            'name'   => 'required|string|max:255',
            'domain' => 'nullable|string|max:255|unique:organizations,domain,' . $id,
        ]);

        $organization->update($validated);

        return response()->json([
            'status' => true,
            'message' => 'Organization updated successfully',
            'data' => $organization,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $organization = Organization::findOrFail($id);

        $organization->delete();

        return response()->json([
            'status' => true,
            'message' => 'Organization deleted successfully',
        ]);
    }
}
