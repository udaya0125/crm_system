<?php

namespace App\Http\Controllers;

use App\Models\HostingManagement;
use App\Models\Notification;
use App\Models\UserLog;
use Illuminate\Http\Request;
use Carbon\Carbon;

class HostingManagementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $hostings = HostingManagement::with('client')->latest()->get();

        // Check for expiring hostings and create notifications + logs
        $this->checkExpiringHostings();

        return response()->json([
            'status' => true,
            'data'   => $hostings
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'hosting_plan'     => 'required|string|max:255',
            'client_id'        => 'required|exists:clients,id',
            'disk_usage'       => 'nullable|string|max:255',
            'renewal_date'     => 'required|date',
            'hosting_provider' => 'required|string|max:255',
        ]);

        $hosting = HostingManagement::create($request->all());
        $hosting->load('client');

        $clientName = $hosting->client?->name ?? 'Unknown Client';

        // Notification
        Notification::create([
            'message' => "New hosting created: '{$hosting->hosting_plan}' for {$clientName}. Renews on " .
                         Carbon::parse($hosting->renewal_date)->format('M d, Y'),
            'is_read' => false,
        ]);

        // User log
        $this->createUserLog(
            title:   'Hosting Created',
            detail:  "Created hosting '{$hosting->hosting_plan}' for {$clientName}. Renews on " .
                     Carbon::parse($hosting->renewal_date)->format('M d, Y'),
            request: $request
        );

        return response()->json([
            'status'  => true,
            'message' => 'Hosting created successfully',
            'data'    => $hosting
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $hosting = HostingManagement::findOrFail($id);

        $request->validate([
            'hosting_plan'     => 'required|string|max:255',
            'client_id'        => 'required|exists:clients,id',
            'disk_usage'       => 'nullable|string|max:255',
            'renewal_date'     => 'required|date',
            'hosting_provider' => 'required|string|max:255',
        ]);

        $hosting->update($request->all());
        $hosting->load('client');

        $clientName = $hosting->client?->name ?? 'Unknown Client';

        // Notification
        Notification::create([
            'message' => "Hosting updated: '{$hosting->hosting_plan}' for {$clientName}. Renews on " .
                         Carbon::parse($hosting->renewal_date)->format('M d, Y'),
            'is_read' => false,
        ]);

        // User log
        $this->createUserLog(
            title:   'Hosting Updated',
            detail:  "Updated hosting '{$hosting->hosting_plan}' for {$clientName}. Renews on " .
                     Carbon::parse($hosting->renewal_date)->format('M d, Y'),
            request: $request
        );

        return response()->json([
            'status'  => true,
            'message' => 'Hosting updated successfully',
            'data'    => $hosting
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, $id)
    {
        $hosting = HostingManagement::with('client')->findOrFail($id);

        $clientName  = $hosting->client?->name ?? 'Unknown Client';
        $hostingPlan = $hosting->hosting_plan;

        $hosting->delete();

        // User log only (no expiry notification needed on delete)
        $this->createUserLog(
            title:   'Hosting Deleted',
            detail:  "Deleted hosting '{$hostingPlan}' for {$clientName}.",
            request: $request
        );

        return response()->json([
            'status'  => true,
            'message' => 'Hosting deleted successfully'
        ]);
    }

    // -------------------------------------------------------------------------
    //  Renewal Checks — Notifications + Logs
    // -------------------------------------------------------------------------

    /**
     * Called on every index() load.
     * Thresholds:
     *   ≤ 15 days        → daily notification + daily log
     *   20, 25, 30, 45   → one-time milestone notification + log
     */
    private function checkExpiringHostings(): void
    {
        $today    = Carbon::today();
        $hostings = HostingManagement::with('client')->get();

        foreach ($hostings as $hosting) {
            $daysLeft   = (int) $today->diffInDays(Carbon::parse($hosting->renewal_date), false);
            $clientName = $hosting->client?->name ?? 'Unknown Client';

            if ($daysLeft < 0) {
                continue; // already past renewal date — skip
            }

            if ($daysLeft <= 15) {
                $this->createDailyNotification($hosting, $clientName, $daysLeft);
                $this->createDailyLog($hosting, $clientName, $daysLeft);
            } elseif (in_array($daysLeft, [20, 25, 30, 45])) {
                $this->createMilestoneNotification($hosting, $clientName, $daysLeft);
                $this->createMilestoneLog($hosting, $clientName, $daysLeft);
            }
        }
    }

    // -------------------------------------------------------------------------
    //  Notification Helpers
    // -------------------------------------------------------------------------

    /**
     * Daily notification — fires once per calendar day per (hosting + daysLeft).
     */
    private function createDailyNotification($hosting, string $clientName, int $daysLeft): void
    {
        $today   = Carbon::today()->toDateString();
        $dayText = $daysLeft === 1 ? 'day' : 'days';

        $alreadySent = Notification::where('message', 'like', "%'{$hosting->hosting_plan}' for {$clientName}%")
            ->where('message', 'like', "%renewal in {$daysLeft} {$dayText}%")
            ->whereDate('created_at', $today)
            ->exists();

        if (!$alreadySent) {
            $urgency = $daysLeft <= 3 ? '🔴 URGENT: ' : '⚠️ ';

            Notification::create([
                'message' => "{$urgency}Hosting '{$hosting->hosting_plan}' for {$clientName} is due for renewal in {$daysLeft} {$dayText}!",
                'is_read' => false,
            ]);
        }
    }

    /**
     * Milestone notification — fires once ever per (hosting + exact day milestone).
     * Exact milestones: 20, 25, 30, 45 days.
     */
    private function createMilestoneNotification($hosting, string $clientName, int $daysLeft): void
    {
        $alreadySent = Notification::where('message', 'like', "%'{$hosting->hosting_plan}' for {$clientName}%")
            ->where('message', 'like', "%renewal in {$daysLeft} days%")
            ->exists();

        if (!$alreadySent) {
            Notification::create([
                'message' => "⏰ Hosting '{$hosting->hosting_plan}' for {$clientName} is due for renewal in {$daysLeft} days. Consider renewing soon.",
                'is_read' => false,
            ]);
        }
    }

    // -------------------------------------------------------------------------
    //  UserLog Helpers
    // -------------------------------------------------------------------------

    /**
     * Generic helper — used for store / update / destroy actions.
     */
    private function createUserLog(string $title, string $detail, Request $request): void
    {
        UserLog::create([
            'name'       => $request->user()?->name ?? 'System',
            'ip_address' => $request->ip(),
            'title'      => "[{$title}] {$detail}",
        ]);
    }

    /**
     * Daily log — once per calendar day per (hosting + daysLeft).
     */
    private function createDailyLog($hosting, string $clientName, int $daysLeft): void
    {
        $today   = Carbon::today()->toDateString();
        $dayText = $daysLeft === 1 ? 'day' : 'days';
        $urgency = $daysLeft <= 3 ? '[URGENT] ' : '[WARNING] ';
        $entry   = "{$urgency}Hosting '{$hosting->hosting_plan}' for {$clientName} is due for renewal in {$daysLeft} {$dayText}!";

        $alreadyLogged = UserLog::where('title', 'like', "%'{$hosting->hosting_plan}' for {$clientName}%")
            ->where('title', 'like', "%renewal in {$daysLeft} {$dayText}%")
            ->whereDate('created_at', $today)
            ->exists();

        if (!$alreadyLogged) {
            UserLog::create([
                'name'       => 'System',
                'ip_address' => request()->ip(),
                'title'      => $entry,
            ]);
        }
    }

    /**
     * Milestone log — fires once ever per (hosting + exact day milestone).
     */
    private function createMilestoneLog($hosting, string $clientName, int $daysLeft): void
    {
        $entry = "[REMINDER] Hosting '{$hosting->hosting_plan}' for {$clientName} is due for renewal in {$daysLeft} days. Consider renewing soon.";

        $alreadyLogged = UserLog::where('title', 'like', "%'{$hosting->hosting_plan}' for {$clientName}%")
            ->where('title', 'like', "%renewal in {$daysLeft} days%")
            ->exists();

        if (!$alreadyLogged) {
            UserLog::create([
                'name'       => 'System',
                'ip_address' => request()->ip(),
                'title'      => $entry,
            ]);
        }
    }
}