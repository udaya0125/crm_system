<?php

namespace App\Http\Controllers;

use App\Models\Lead;
use App\Models\UserLog;
use App\Mail\MeetingScheduled;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use App\Http\Requests\Lead\StoreLeadRequest;
use App\Http\Requests\Lead\UpdateLeadRequest;

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
    public function store(StoreLeadRequest $request)
    {
        $validated = $request->validated();

        $lead = Lead::create($validated);

        // ── Notify admin only if a follow-up date was assigned on creation ──
        if (!empty($lead->next_followup_date)) {
            $this->sendAdminMail($lead, 'created');
        }

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
    public function update(UpdateLeadRequest $request, $id)
    {
        $lead = Lead::findOrFail($id);

        $lead->update($request->validated());

        // ── Notify admin only if next_followup_date was just assigned/changed ──
        if ($lead->wasChanged('next_followup_date') && !empty($lead->next_followup_date)) {
            $this->sendAdminMail($lead, 'updated');
        }

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
     * Send lead follow-up notification email to admin(s).
     *
     * NOTE: Recipient is temporarily hardcoded to a placeholder address.
     * Swap FOLLOWUP_ADMIN_EMAIL below for the real address(es) when ready —
     * or move it back to .env via ADMIN_EMAIL once confirmed.
     */
    private function sendAdminMail(Lead $lead, string $mailType): void
    {
        $adminEmails = ['admin@gmail.com'];

        try {
            Mail::to($adminEmails)
                ->send(new MeetingScheduled($lead, $mailType));
        } catch (\Exception $e) {
            Log::error("LeadController: failed to send admin mail for lead [{$lead->client_name}]: " . $e->getMessage());
        }
    }
}