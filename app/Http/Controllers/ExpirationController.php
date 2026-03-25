<?php

namespace App\Http\Controllers;

use App\Models\Expiration;
use App\Models\Notification;
use App\Models\UserLog;
use Carbon\Carbon;
use Illuminate\Http\Request;

class ExpirationController extends Controller
{
    public function index()
    {
        $expirations = Expiration::with('client')->latest()->get();

        // Check for expiring items and create notifications + logs
        $this->checkExpiringItems();

        return response()->json([
            'data' => $expirations,
            'message' => 'Expirations retrieved successfully',
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
        $expiration->load('client');

        // Notification
        $this->createExpirationNotification($expiration, 'created');

        // User log
        $clientName = $expiration->client?->organization_name ?? 'Unknown Client';
        $this->createUserLog(
            title: 'Expiration Created',
            detail: "Created expiration '{$expiration->title}' for {$clientName}. Expires on ".
                    Carbon::parse($expiration->expiration_date)->format('M d, Y'),
            request: $request
        );

        return response()->json([
            'message' => 'Expiration created successfully',
            'data' => $expiration,
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
        $expiration->load('client');

        // Notification
        $this->createExpirationNotification($expiration, 'updated');

        // User log
        $clientName = $expiration->client?->organization_name ?? 'Unknown Client';
        $this->createUserLog(
            title: 'Expiration Updated',
            detail: "Updated expiration '{$expiration->title}' for {$clientName}. Expires on ".
                    Carbon::parse($expiration->expiration_date)->format('M d, Y'),
            request: $request
        );

        return response()->json([
            'message' => 'Expiration updated successfully',
            'data' => $expiration,
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $expiration = Expiration::with('client')->findOrFail($id);
        $clientName = $expiration->client?->organization_name ?? 'Unknown Client';
        $title = $expiration->title;

        $expiration->delete();

        // User log (no notification needed for delete)
        $this->createUserLog(
            title: 'Expiration Deleted',
            detail: "Deleted expiration '{$title}' for {$clientName}.",
            request: $request
        );

        return response()->json([
            'message' => 'Expiration deleted successfully',
        ]);
    }

    // -------------------------------------------------------------------------
    //  Notifications
    // -------------------------------------------------------------------------

    /**
     * Notification on manual create / update actions.
     */
    private function createExpirationNotification($expiration, string $action): void
    {
        $clientName = $expiration->client?->organization_name ?? 'Unknown Client';

        $message = match ($action) {
            'created' => "New expiration created: '{$expiration->title}' for {$clientName}. Expires on ".
                         Carbon::parse($expiration->expiration_date)->format('M d, Y'),
            'updated' => "Expiration updated: '{$expiration->title}' for {$clientName}. Expires on ".
                         Carbon::parse($expiration->expiration_date)->format('M d, Y'),
            default => '',
        };

        if ($message) {
            Notification::create(['message' => $message, 'is_read' => false]);
        }
    }

    /**
     * Called on every index() load — checks all expirations and fires
     * scheduled notifications based on days remaining.
     *
     * Thresholds:
     *   ≤ 15 days  → daily notification
     *   20 days    → once
     *   25 days    → once
     *   30 days    → once
     *   45 days    → once
     */
    private function checkExpiringItems(): void
    {
        $today = Carbon::today();
        $expirations = Expiration::with('client')->get();

        foreach ($expirations as $expiration) {
            $daysLeft = (int) $today->diffInDays(Carbon::parse($expiration->expiration_date), false);
            $clientName = $expiration->client?->organization_name ?? 'Unknown Client';

            if ($daysLeft < 0) {
                continue; // already expired — skip
            }

            if ($daysLeft <= 15) {
                // Daily notification for the last 15 days
                $this->createDailyNotification($expiration, $clientName, $daysLeft);
            } elseif (in_array($daysLeft, [20, 25, 30, 45])) {
                // One-time milestone notifications
                $this->createMilestoneNotification($expiration, $clientName, $daysLeft);
            }
        }
    }

    /**
     * Daily notification — fires once per calendar day per (expiration + daysLeft).
     */
    private function createDailyNotification($expiration, string $clientName, int $daysLeft): void
    {
        $today = Carbon::today()->toDateString();

        $alreadySent = Notification::where('message', 'like', "%'{$expiration->title}' for {$clientName}%")
            ->where('message', 'like', "%expiring in {$daysLeft} day%")
            ->whereDate('created_at', $today)
            ->exists();

        if (! $alreadySent) {
            $dayText = $daysLeft === 1 ? 'day' : 'days';
            $urgency = $daysLeft <= 3 ? '🔴 URGENT: ' : '⚠️ ';

            Notification::create([
                'message' => "{$urgency}'{$expiration->title}' for {$clientName} is expiring in {$daysLeft} {$dayText}!",
                'is_read' => false,
            ]);
        }
    }

    /**
     * Milestone notification — fires once ever per (expiration + exact day milestone).
     * Exact milestones: 20, 25, 30, 45 days.
     */
    private function createMilestoneNotification($expiration, string $clientName, int $daysLeft): void
    {
        $alreadySent = Notification::where('message', 'like', "%'{$expiration->title}' for {$clientName}%")
            ->where('message', 'like', "%expiring in {$daysLeft} days%")
            ->exists();

        if (! $alreadySent) {
            Notification::create([
                'message' => "⏰ '{$expiration->title}' for {$clientName} is expiring in {$daysLeft} days. Consider renewing soon.",
                'is_read' => false,
            ]);
        }
    }

    // -------------------------------------------------------------------------
    //  User Logs
    // -------------------------------------------------------------------------

    /**
     * Generic helper to write a UserLog entry.
     */
    private function createUserLog(string $title, string $detail, Request $request): void
    {
        UserLog::create([
            'name' => $request->user()?->name ?? 'System',
            'ip_address' => $request->ip(),
            'title' => "[{$title}] {$detail}",
        ]);
    }

    /**
     * Called alongside checkExpiringItems() — mirrors the same thresholds but
     * writes to UserLog instead of Notification.
     *
     * Thresholds:
     *   ≤ 15 days  → daily log entry
     *   20 / 25 / 30 / 45 days → once-only milestone log entry
     */
    private function checkExpiringItemsLog(): void
    {
        $today = Carbon::today();
        $expirations = Expiration::with('client')->get();

        foreach ($expirations as $expiration) {
            $daysLeft = (int) $today->diffInDays(Carbon::parse($expiration->expiration_date), false);
            $clientName = $expiration->client?->organization_name ?? 'Unknown Client';

            if ($daysLeft < 0) {
                continue;
            }

            if ($daysLeft <= 15) {
                $this->createDailyExpirationLog($expiration, $clientName, $daysLeft);
            } elseif (in_array($daysLeft, [20, 25, 30, 45])) {
                $this->createMilestoneExpirationLog($expiration, $clientName, $daysLeft);
            }
        }
    }

    /**
     * Daily log — once per calendar day per (expiration + daysLeft).
     */
    private function createDailyExpirationLog($expiration, string $clientName, int $daysLeft): void
    {
        $today = Carbon::today()->toDateString();
        $dayText = $daysLeft === 1 ? 'day' : 'days';
        $urgency = $daysLeft <= 3 ? '[URGENT] ' : '[WARNING] ';
        $entry = "{$urgency}'{$expiration->title}' for {$clientName} is expiring in {$daysLeft} {$dayText}!";

        $alreadyLogged = UserLog::where('title', 'like', "%'{$expiration->title}' for {$clientName}%")
            ->where('title', 'like', "%expiring in {$daysLeft} {$dayText}%")
            ->whereDate('created_at', $today)
            ->exists();

        if (! $alreadyLogged) {
            UserLog::create([
                'name' => 'System',
                'ip_address' => request()->ip(),
                'title' => $entry,
            ]);
        }
    }

    /**
     * Milestone log — fires once ever per (expiration + exact day milestone).
     */
    private function createMilestoneExpirationLog($expiration, string $clientName, int $daysLeft): void
    {
        $entry = "[REMINDER] '{$expiration->title}' for {$clientName} is expiring in {$daysLeft} days. Consider renewing soon.";

        $alreadyLogged = UserLog::where('title', 'like', "%'{$expiration->title}' for {$clientName}%")
            ->where('title', 'like', "%expiring in {$daysLeft} days%")
            ->exists();

        if (! $alreadyLogged) {
            UserLog::create([
                'name' => 'System',
                'ip_address' => request()->ip(),
                'title' => $entry,
            ]);
        }
    }
}
