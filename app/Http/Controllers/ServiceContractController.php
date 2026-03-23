<?php

namespace App\Http\Controllers;

use App\Models\ServiceContract;
use Illuminate\Http\Request;

class ServiceContractController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $contracts = ServiceContract::latest()->get();

        return response()->json([
            'status' => true,
            'data' => $contracts
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    // public function store(Request $request)
    // {
    //     $validated = $request->validate([
    //         'customer_name'   => 'required|string|max:255',
    //         'service_type'    => 'required|string|max:255',
    //         'grand_total'     => 'required|numeric',
    //         'duration_unit'   => 'required|string',
    //         'duration_value'  => 'required|integer',
    //         'expiry_date'     => 'required|date',
    //         'invoice_number'  => 'nullable|string|max:255',
    //         'invoice_date'    => 'nullable|date',
    //         'service_names'   => 'nullable|string',
    //     ]);

    //     $contract = ServiceContract::create($validated);

    //     return response()->json([
    //         'status' => true,
    //         'message' => 'Service contract created successfully',
    //         'data' => $contract
    //     ]);
    // }

    /**
     * Update the specified resource in storage.
     */
    // public function update(Request $request, $id)
    // {
    //     $contract = ServiceContract::findOrFail($id);

    //     $validated = $request->validate([
    //         'customer_name'   => 'sometimes|required|string|max:255',
    //         'service_type'    => 'sometimes|required|string|max:255',
    //         'grand_total'     => 'sometimes|required|numeric',
    //         'duration_unit'   => 'sometimes|required|string',
    //         'duration_value'  => 'sometimes|required|integer',
    //         'expiry_date'     => 'sometimes|required|date',
    //         'invoice_number'  => 'nullable|string|max:255',
    //         'invoice_date'    => 'nullable|date',
    //         'service_names'   => 'nullable|string',
    //     ]);

    //     $contract->update($validated);

    //     return response()->json([
    //         'status' => true,
    //         'message' => 'Service contract updated successfully',
    //         'data' => $contract
    //     ]);
    // }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $contract = ServiceContract::findOrFail($id);
        $contract->delete();

        return response()->json([
            'status' => true,
            'message' => 'Service contract deleted successfully'
        ]);
    }
}