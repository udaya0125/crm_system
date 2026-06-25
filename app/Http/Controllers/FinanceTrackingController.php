<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\FinanceTracking;
use App\Models\UserLog;
use App\Http\Requests\StoreFinanceTrackingRequest;
use App\Http\Requests\UpdateFinanceTrackingRequest;

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
            'data'   => $finances
        ]);
    }

    /**
     * Store new finance record
     */
    // public function store(Request $request)
    // {
    //     $request->validate([
    //         'invoice_id'  => 'nullable|string|max:255|unique:finance_trackings,invoice_id',
    //         'client'       => 'required|string|max:255',
    //         'project'      => 'required|string|max:255',
    //         'invoice_date' => 'required|date',
    //         'due_date'     => 'required|date',
    //         'amount'       => 'required|numeric',
    //         'paid_amount'  => 'nullable|numeric',
    //         'status'       => 'nullable|string'
    //     ]);

    //     $paidAmount = $request->paid_amount ?? 0;
    //     $finance = FinanceTracking::create([
    //         'invoice_id'  => $request->invoice_id,
    //         'client'      => $request->client,
    //         'project'     => $request->project,
    //         'invoice_date'=> $request->invoice_date,
    //         'due_date'    => $request->due_date,
    //         'amount'      => $request->amount,
    //         'paid_amount' => $paidAmount,
    //         'balance'     => $request->amount - $paidAmount,
    //         'status'      => $request->status ?? 'pending',
    //     ]);

    //     UserLog::create([
    //         'name'       => $request->user()?->name ?? 'System',
    //         'ip_address' => $request->ip(),
    //         'title'      => "Created finance record: {$finance->project} for {$finance->client}",
    //     ]);

    //     return response()->json([
    //         'status'  => true,
    //         'message' => 'Finance record created successfully',
    //         'data'    => $finance
    //     ]);
    // }

    public function store(StoreFinanceTrackingRequest $request)
{
    $validated = $request->validated();

    $paidAmount = $validated['paid_amount'] ?? 0;

    $finance = FinanceTracking::create([
        ...$validated,
        'paid_amount' => $paidAmount,
        'balance' => $validated['amount'] - $paidAmount,
        'status' => $validated['status'] ?? 'pending',
    ]);

            UserLog::create([
            'name'       => $request->user()?->name ?? 'System',
            'ip_address' => $request->ip(),
            'title'      => "Created finance record: {$finance->project} for {$finance->client}",
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
    // public function update(Request $request, $id)
    // {
    //     $finance = FinanceTracking::findOrFail($id);

    //     $request->validate([
    //         'invoice_id'  => 'nullable|string|max:255|unique:finance_trackings,invoice_id,' . $id,
    //         'client'       => 'required|string|max:255',
    //         'project'      => 'required|string|max:255',
    //         'invoice_date' => 'required|date',
    //         'due_date'     => 'required|date',
    //         'amount'       => 'required|numeric',
    //         'paid_amount'  => 'nullable|numeric',
    //         'status'       => 'nullable|string'
    //     ]);

    //     $paidAmount = $request->paid_amount ?? 0;
    //     $finance->update([
    //         'invoice_id'  => $request->invoice_id,
    //         'client'      => $request->client,
    //         'project'     => $request->project,
    //         'invoice_date'=> $request->invoice_date,
    //         'due_date'    => $request->due_date,
    //         'amount'      => $request->amount,
    //         'paid_amount' => $paidAmount,
    //         'balance'     => $request->amount - $paidAmount,
    //         'status'      => $request->status,
    //     ]);

    //     UserLog::create([
    //         'name'       => $request->user()?->name ?? 'System',
    //         'ip_address' => $request->ip(),
    //         'title'      => "Updated finance record: {$finance->project} for {$finance->client}",
    //     ]);

    //     return response()->json([
    //         'status'  => true,
    //         'message' => 'Finance record updated successfully',
    //         'data'    => $finance
    //     ]);
    // }

    public function update(UpdateFinanceTrackingRequest $request, $id)
{
    $finance = FinanceTracking::findOrFail($id);

    $validated = $request->validated();

    $paidAmount = $validated['paid_amount'] ?? 0;

    $finance->update([
        ...$validated,
        'paid_amount' => $paidAmount,
        'balance' => $validated['amount'] - $paidAmount,
    ]);

    UserLog::create([
        'name'       => $request->user()?->name ?? 'System',
        'ip_address' => $request->ip(),
        'title'      => "Updated finance record: {$finance->project} for {$finance->client}",
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
    public function destroy(Request $request, $id)
    {
        $finance = FinanceTracking::findOrFail($id);
        $project = $finance->project;
        $client  = $finance->client;
        $finance->delete();

        UserLog::create([
            'name'       => $request->user()?->name ?? 'System',
            'ip_address' => $request->ip(),
            'title'      => "Deleted finance record: {$project} for {$client}",
        ]);

        return response()->json([
            'status'  => true,
            'message' => 'Finance record deleted successfully'
        ]);
    }
}