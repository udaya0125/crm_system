<?php

namespace App\Http\Controllers;

use App\Models\Expiration;
use Illuminate\Http\Request;

class ExpirationController extends Controller
{
    public function index()
    {
        $expirations = Expiration::with('client')->latest()->get();
        return response()->json([
            'data' => $expirations,
            'message' => 'Expirations retrieved successfully'
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'title' => 'required|string|max:255',
            'last_renewal_date' => 'required|date',
            'duration' => 'required|integer|min:1|max:120',
            'expiration_date' => 'required|date|after_or_equal:last_renewal_date',
        ]);

        $expiration = Expiration::create($validated);

        return response()->json([
            'message' => 'Expiration created successfully',
            'data' => $expiration->load('client'),
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $expiration = Expiration::findOrFail($id);

        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'title' => 'required|string|max:255',
            'last_renewal_date' => 'required|date',
            'duration' => 'required|integer|min:1|max:120',
            'expiration_date' => 'required|date|after_or_equal:last_renewal_date',
        ]);

        $expiration->update($validated);

        return response()->json([
            'message' => 'Expiration updated successfully',
            'data' => $expiration->load('client'),
        ]);
    }

    public function destroy($id)
    {
        $expiration = Expiration::findOrFail($id);
        $expiration->delete();

        return response()->json([
            'message' => 'Expiration deleted successfully',
        ]);
    }
}