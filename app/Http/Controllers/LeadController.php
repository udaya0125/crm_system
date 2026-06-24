<?php

namespace App\Http\Controllers;

use App\Models\Lead;
use App\Models\UserLog;
use App\Mail\MeetingScheduled;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class LeadController extends Controller
{
    /**
     * Display a listing of leads
     */
    public function index()
    {
        $leads = Lead::latest()->get();

        return response()->json([
            'success' => true,
            'data' => $leads
        ]);
    }

    /**
     * Store a newly created lead
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_name'          => 'required|string|max:255',
            'company_name'         => 'nullable|string|max:255',
            'phone'                => 'required|string|max:20',
            'email'                => 'nullable|email|max:255',
            'service_interested'   => 'nullable|string|max:255',
            'lead_source'          => 'nullable|string|max:255',
            'assigned_salesperson' => 'nullable|string|max:255',
            'next_followup_date'   => 'nullable|date',
            'notes'                => 'nullable|string',
            'status'               => 'nullable|string|max:100',
        ]);

        $lead = Lead::create($validated);

        // ── Notify admin of new lead ───────────────────────────────────────
        $this->sendAdminMail($lead, 'created');

        UserLog::create([
            'name'       => $request->user()?->name ?? 'System',
            'ip_address' => $request->ip(),
            'title'      => "Created lead: {$lead->client_name}",
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Lead created successfully',
            'data'    => $lead
        ], 201);
    }

    /**
     * Update the specified lead
     */
    public function update(Request $request, $id)
    {
        $lead = Lead::findOrFail($id);

        $validated = $request->validate([
            'client_name'          => 'sometimes|required|string|max:255',
            'company_name'         => 'nullable|string|max:255',
            'phone'                => 'sometimes|required|string|max:20',
            'email'                => 'nullable|email|max:255',
            'service_interested'   => 'nullable|string|max:255',
            'lead_source'          => 'nullable|string|max:255',
            'assigned_salesperson' => 'nullable|string|max:255',
            'next_followup_date'   => 'nullable|date',
            'notes'                => 'nullable|string',
            'status'               => 'nullable|string|max:100',
        ]);

        $lead->update($validated);

        // ── Notify admin of lead update ────────────────────────────────────
        $this->sendAdminMail($lead, 'updated');

        UserLog::create([
            'name'       => $request->user()?->name ?? 'System',
            'ip_address' => $request->ip(),
            'title'      => "Updated lead: {$lead->client_name}",
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Lead updated successfully',
            'data'    => $lead
        ]);
    }

    /**
     * Remove the specified lead
     */
    public function destroy(Request $request, $id)
    {
        $lead       = Lead::findOrFail($id);
        $clientName = $lead->client_name;
        $lead->delete();

        UserLog::create([
            'name'       => $request->user()?->name ?? 'System',
            'ip_address' => $request->ip(),
            'title'      => "Deleted lead: {$clientName}",
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Lead deleted successfully'
        ]);
    }

    // ──────────────────────────────────────────────────────────────────────
    // Private Helper
    // ──────────────────────────────────────────────────────────────────────

    /**
     * Send lead notification email to admin(s).
     * Reads ADMIN_EMAIL from .env — supports comma-separated multiple addresses.
     */
    private function sendAdminMail(Lead $lead, string $mailType): void
    {
        $adminEmails = array_filter(
            array_map('trim', explode(',', env('ADMIN_EMAIL', '')))
        );

        if (empty($adminEmails)) {
            return;
        }

        try {
            Mail::to($adminEmails)
                ->send(new MeetingScheduled($lead, $mailType));
        } catch (\Exception $e) {
            Log::error("LeadController: failed to send admin mail for lead [{$lead->client_name}]: " . $e->getMessage());
        }
    }
}