<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\FinanceTracking;

class FinanceTrackingController extends Controller
{
    /**
     * Display all finance records
     */
    public function index()
    {
        $finances = FinanceTracking::latest()->get();

        return response()->json([
            'status' => true,
            'data' => $finances
        ]);
    }

    /**
     * Store new finance record
     */
    public function store(Request $request)
    {
        $request->validate([
            'client' => 'required|string|max:255',
            'project' => 'required|string|max:255',
            'invoice_date' => 'required|date',
            'due_date' => 'required|date',
            'amount' => 'required|numeric',
            'paid_amount' => 'nullable|numeric',
            'status' => 'nullable|string'
        ]);

        $finance = FinanceTracking::create([
            'client' => $request->client,
            'project' => $request->project,
            'invoice_date' => $request->invoice_date,
            'due_date' => $request->due_date,
            'amount' => $request->amount,
            'paid_amount' => $request->paid_amount ?? 0,
            'status' => $request->status ?? 'pending',
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Finance record created successfully',
            'data' => $finance
        ]);
    }

    /**
     * Update finance record
     */
    public function update(Request $request, $id)
    {
        $finance = FinanceTracking::findOrFail($id);

        $request->validate([
            'client' => 'required|string|max:255',
            'project' => 'required|string|max:255',
            'invoice_date' => 'required|date',
            'due_date' => 'required|date',
            'amount' => 'required|numeric',
            'paid_amount' => 'nullable|numeric',
            'status' => 'nullable|string'
        ]);

        $finance->update([
            'client' => $request->client,
            'project' => $request->project,
            'invoice_date' => $request->invoice_date,
            'due_date' => $request->due_date,
            'amount' => $request->amount,
            'paid_amount' => $request->paid_amount ?? 0,
            'status' => $request->status
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Finance record updated successfully',
            'data' => $finance
        ]);
    }

    /**
     * Delete finance record
     */
    public function destroy($id)
    {
        $finance = FinanceTracking::findOrFail($id);
        $finance->delete();

        return response()->json([
            'status' => true,
            'message' => 'Finance record deleted successfully'
        ]);
    }
}