<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    /**
     * Display a listing of payments.
     */
    public function index()
    {
        $payments = Payment::latest()->get();

        return response()->json([
            'status' => true,
            'data' => $payments,
        ]);
    }

    /**
     * Store a newly created payment.
     */
    // public function store(Request $request)
    // {
    //     $validated = $request->validate([
    //         'customer_name'    => 'required|string|max:255',
    //         'amount'           => 'required|numeric',
    //         'service_type'     => 'required|string|max:255',
    //         'payment_reference'=> 'nullable|string|max:255',
    //         'paymentmode'      => 'nullable|string|max:255',
    //         'invoice_reference'=> 'required|string|max:255',
    //         'receiveddate'     => 'required|date',
    //     ]);

    //     $payment = Payment::create($validated);

    //     return response()->json([
    //         'status' => true,
    //         'message' => 'Payment created successfully',
    //         'data' => $payment
    //     ]);
    // }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'amount' => 'required|numeric',
            'service_type' => 'required|string|max:255',
            'payment_reference' => 'nullable|string|max:255',
            'paymentmode' => 'nullable|string|max:255',
            'invoice_reference' => 'required|string|max:255',
            'receiveddate' => 'required|date',
        ]);

        Log::info('Creating payment', [
            'customer_name' => $validated['customer_name'],
            'amount' => $validated['amount'],
            'service_type' => $validated['service_type'],
            'invoice_reference' => $validated['invoice_reference'],
            'requested_by' => $request->user()?->id ?? 'guest',
            'ip' => $request->ip(),
        ]);

        try {
            $payment = Payment::create($validated);

            Log::info('Payment created successfully', [
                'payment_id' => $payment->id,
                'customer_name' => $payment->customer_name,
                'amount' => $payment->amount,
                'invoice_reference' => $payment->invoice_reference,
                'receiveddate' => $payment->receiveddate,
            ]);

            return response()->json([
                'status' => true,
                'message' => 'Payment created successfully',
                'data' => $payment,
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to create payment', [
                'error' => $e->getMessage(),
                'customer_name' => $validated['customer_name'],
                'amount' => $validated['amount'],
                'invoice_reference' => $validated['invoice_reference'],
                'requested_by' => $request->user()?->id ?? 'guest',
                'ip' => $request->ip(),
            ]);

            return response()->json([
                'status' => false,
                'message' => 'Failed to create payment',
            ], 500);
        }
    }

    /**
     * Update an existing payment.
     */
    // public function update(Request $request, $id)
    // {
    //     $payment = Payment::findOrFail($id);

    //     $validated = $request->validate([
    //         'customer_name'    => 'sometimes|required|string|max:255',
    //         'amount'           => 'sometimes|required|numeric',
    //         'service_type'     => 'sometimes|required|string|max:255',
    //         'payment_reference'=> 'nullable|string|max:255',
    //         'paymentmode'      => 'nullable|string|max:255',
    //         'invoice_reference'=> 'sometimes|required|string|max:255',
    //         'receiveddate'     => 'sometimes|required|date',
    //     ]);

    //     $payment->update($validated);

    //     return response()->json([
    //         'status' => true,
    //         'message' => 'Payment updated successfully',
    //         'data' => $payment
    //     ]);
    // }

    /**
     * Delete a payment.
     */
    public function destroy($id)
    {
        $payment = Payment::findOrFail($id);
        $payment->delete();

        return response()->json([
            'status' => true,
            'message' => 'Payment deleted successfully',
        ]);
    }
}
