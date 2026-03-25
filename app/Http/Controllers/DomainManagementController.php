<?php

namespace App\Http\Controllers;

use App\Models\DomainManagement;
use App\Models\Notification;
use App\Models\UserLog;
use Illuminate\Http\Request;
use Carbon\Carbon;

class DomainManagementController extends Controller
{
    // Display all domains
    public function index()
    {
        $domains = DomainManagement::with('client')->latest()->get();

        // Check for expiring domains and create notifications + logs
        $this->checkExpiringDomains();

        return response()->json([
            'status' => true,
            'data'   => $domains
        ]);
    }

    // Store new domain
    public function store(Request $request)
    {
        $request->validate([
            'domain_name'         => 'required|string|max:255',
            'client_id'           => 'required|exists:clients,id',
            'register'            => 'required|string|max:255',
            'purchase_date'       => 'required|date',
            'expiry_date'         => 'required|date',
            'auto_renewal_status' => 'required|string',
            'dns_provider'        => 'nullable|string|max:255',
        ]);

        $domain = DomainManagement::create($request->all());
        $domain->load('client');

        $clientName = $domain->client?->organization_name ?? 'Unknown Client';

        // Notification
        Notification::create([
            'message' => "New domain created: '{$domain->domain_name}' for {$clientName}. Expires on " .
                         Carbon::parse($domain->expiry_date)->format('M d, Y'),
            'is_read' => false,
        ]);

        // User log
        $this->createUserLog(
            title:   'Domain Created',
            detail:  "Created domain '{$domain->domain_name}' for {$clientName}. Expires on " .
                     Carbon::parse($domain->expiry_date)->format('M d, Y'),
            request: $request
        );

        return response()->json([
            'status'  => true,
            'message' => 'Domain created successfully',
            'data'    => $domain
        ]);
    }

    // Update domain
    public function update(Request $request, $id)
    {
        $domain = DomainManagement::findOrFail($id);

        $request->validate([
            'domain_name'         => 'required|string|max:255',
            'client_id'           => 'required|exists:clients,id',
            'register'            => 'required|string|max:255',
            'purchase_date'       => 'required|date',
            'expiry_date'         => 'required|date',
            'auto_renewal_status' => 'required|string',
            'dns_provider'        => 'nullable|string|max:255',
        ]);

        $domain->update($request->all());
        $domain->load('client');

        $clientName = $domain->client?->organization_name ?? 'Unknown Client';

        // Notification
        Notification::create([
            'message' => "Domain updated: '{$domain->domain_name}' for {$clientName}. Expires on " .
                         Carbon::parse($domain->expiry_date)->format('M d, Y'),
            'is_read' => false,
        ]);

        // User log
        $this->createUserLog(
            title:   'Domain Updated',
            detail:  "Updated domain '{$domain->domain_name}' for {$clientName}. Expires on " .
                     Carbon::parse($domain->expiry_date)->format('M d, Y'),
            request: $request
        );

        return response()->json([
            'status'  => true,
            'message' => 'Domain updated successfully',
            'data'    => $domain
        ]);
    }

    // Delete domain
    public function destroy(Request $request, $id)
    {
        $domain = DomainManagement::with('client')->findOrFail($id);

        $clientName  = $domain->client?->organization_name ?? 'Unknown Client';
        $domainName  = $domain->domain_name;

        $domain->delete();

        // User log only (no expiry notification needed on delete)
        $this->createUserLog(
            title:   'Domain Deleted',
            detail:  "Deleted domain '{$domainName}' for {$clientName}.",
            request: $request
        );

        return response()->json([
            'status'  => true,
            'message' => 'Domain deleted successfully'
        ]);
    }

    // -------------------------------------------------------------------------
    //  Expiry Checks — Notifications + Logs
    // -------------------------------------------------------------------------

    /**
     * Called on every index() load.
     * Thresholds:
     *   ≤ 15 days        → daily notification + daily log
     *   20, 25, 30, 45   → one-time milestone notification + log
     */
    private function checkExpiringDomains(): void
    {
        $today   = Carbon::today();
        $domains = DomainManagement::with('client')->get();

        foreach ($domains as $domain) {
            $daysLeft   = (int) $today->diffInDays(Carbon::parse($domain->expiry_date), false);
            $clientName = $domain->client?->organization_name ?? 'Unknown Client';

            if ($daysLeft < 0) {
                continue; // already expired — skip
            }

            if ($daysLeft <= 15) {
                $this->createDailyNotification($domain, $clientName, $daysLeft);
                $this->createDailyLog($domain, $clientName, $daysLeft);
            } elseif (in_array($daysLeft, [20, 25, 30, 45])) {
                $this->createMilestoneNotification($domain, $clientName, $daysLeft);
                $this->createMilestoneLog($domain, $clientName, $daysLeft);
            }
        }
    }

    // -------------------------------------------------------------------------
    //  Notification Helpers
    // -------------------------------------------------------------------------

    /**
     * Daily notification — fires once per calendar day per (domain + daysLeft).
     */
    private function createDailyNotification($domain, string $clientName, int $daysLeft): void
    {
        $today   = Carbon::today()->toDateString();
        $dayText = $daysLeft === 1 ? 'day' : 'days';

        $alreadySent = Notification::where('message', 'like', "%'{$domain->domain_name}' for {$clientName}%")
            ->where('message', 'like', "%expiring in {$daysLeft} {$dayText}%")
            ->whereDate('created_at', $today)
            ->exists();

        if (!$alreadySent) {
            $urgency = $daysLeft <= 3 ? '🔴 URGENT: ' : '⚠️ ';

            Notification::create([
                'message' => "{$urgency}Domain '{$domain->domain_name}' for {$clientName} is expiring in {$daysLeft} {$dayText}!",
                'is_read' => false,
            ]);
        }
    }

    /**
     * Milestone notification — fires once ever per (domain + exact day milestone).
     * Exact milestones: 20, 25, 30, 45 days.
     */
    private function createMilestoneNotification($domain, string $clientName, int $daysLeft): void
    {
        $alreadySent = Notification::where('message', 'like', "%'{$domain->domain_name}' for {$clientName}%")
            ->where('message', 'like', "%expiring in {$daysLeft} days%")
            ->exists();

        if (!$alreadySent) {
            Notification::create([
                'message' => "⏰ Domain '{$domain->domain_name}' for {$clientName} is expiring in {$daysLeft} days. Consider renewing soon.",
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
     * Daily log — once per calendar day per (domain + daysLeft).
     */
    private function createDailyLog($domain, string $clientName, int $daysLeft): void
    {
        $today   = Carbon::today()->toDateString();
        $dayText = $daysLeft === 1 ? 'day' : 'days';
        $urgency = $daysLeft <= 3 ? '[URGENT] ' : '[WARNING] ';
        $entry   = "{$urgency}Domain '{$domain->domain_name}' for {$clientName} is expiring in {$daysLeft} {$dayText}!";

        $alreadyLogged = UserLog::where('title', 'like', "%'{$domain->domain_name}' for {$clientName}%")
            ->where('title', 'like', "%expiring in {$daysLeft} {$dayText}%")
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
     * Milestone log — fires once ever per (domain + exact day milestone).
     */
    private function createMilestoneLog($domain, string $clientName, int $daysLeft): void
    {
        $entry = "[REMINDER] Domain '{$domain->domain_name}' for {$clientName} is expiring in {$daysLeft} days. Consider renewing soon.";

        $alreadyLogged = UserLog::where('title', 'like', "%'{$domain->domain_name}' for {$clientName}%")
            ->where('title', 'like', "%expiring in {$daysLeft} days%")
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