<?php

namespace App\Http\Controllers;

use App\Models\ServiceContract;
use App\Models\UserLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

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
    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_name'  => 'required|string|max:255',
            'service_type'   => 'required|string|max:255',
            'grand_total'    => 'required|numeric',
            'duration_unit'  => 'required|string',
            'duration_value' => 'required|numeric',
            'expiry_date'    => 'required|date',
            'invoice_number' => 'nullable|string|max:255',
            'invoice_date'   => 'nullable|date',
            'service_names'  => 'nullable|array',
        ]);

        if (!empty($validated['service_names'])) {
            $validated['service_names'] = implode(', ', $validated['service_names']);
        }

        Log::info('Creating service contract', [
            'customer_name' => $validated['customer_name'],
            'service_type'  => $validated['service_type'],
            'grand_total'   => $validated['grand_total'],
            'requested_by'  => $request->user()?->id ?? 'guest',
            'ip'            => $request->ip(),
        ]);

        try {
            $contract = ServiceContract::create($validated);

            Log::info('Service contract created successfully', [
                'contract_id'   => $contract->id,
                'customer_name' => $contract->customer_name,
                'expiry_date'   => $contract->expiry_date,
            ]);

            UserLog::create([
                'name'       => $request->user()?->name ?? 'guest',
                'ip_address' => $request->ip(),
                'title'      => "Created service contract for {$contract->customer_name} | Service: {$contract->service_type} | Total: {$contract->grand_total} | Expiry: {$contract->expiry_date}",
            ]);

            return response()->json([
                'status'  => true,
                'message' => 'Service contract created successfully',
                'data'    => $contract
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to create service contract', [
                'error'         => $e->getMessage(),
                'customer_name' => $validated['customer_name'],
                'requested_by'  => $request->user()?->id ?? 'guest',
                'ip'            => $request->ip(),
            ]);

            return response()->json([
                'status'  => false,
                'message' => 'Failed to create service contract',
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    // public function update(Request $request, $id)
    // {
    //     $contract = ServiceContract::findOrFail($id);

    //     $validated = $request->validate([
    //         'customer_name'  => 'sometimes|required|string|max:255',
    //         'service_type'   => 'sometimes|required|string|max:255',
    //         'grand_total'    => 'sometimes|required|numeric',
    //         'duration_unit'  => 'sometimes|required|string',
    //         'duration_value' => 'sometimes|required|integer',
    //         'expiry_date'    => 'sometimes|required|date',
    //         'invoice_number' => 'nullable|string|max:255',
    //         'invoice_date'   => 'nullable|date',
    //         'service_names'  => 'nullable|string',
    //     ]);

    //     $contract->update($validated);

    //     UserLog::create([
    //         'name'       => $request->user()?->name ?? 'guest',
    //         'ip_address' => $request->ip(),
    //         'title'      => "Updated service contract (ID: {$contract->id}) for {$contract->customer_name} | Service: {$contract->service_type} | Total: {$contract->grand_total} | Expiry: {$contract->expiry_date}",
    //     ]);

    //     return response()->json([
    //         'status'  => true,
    //         'message' => 'Service contract updated successfully',
    //         'data'    => $contract
    //     ]);
    // }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, $id)
    {
        $contract = ServiceContract::findOrFail($id);
        $contract->delete();

        UserLog::create([
            'name'       => $request->user()?->name ?? 'guest',
            'ip_address' => $request->ip(),
            'title'      => "Deleted service contract (ID: {$contract->id}) for {$contract->customer_name} | Service: {$contract->service_type} | Total: {$contract->grand_total}",
        ]);

        return response()->json([
            'status'  => true,
            'message' => 'Service contract deleted successfully'
        ]);
    }
}