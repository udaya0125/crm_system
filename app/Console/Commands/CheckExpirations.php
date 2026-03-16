<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Expiration;
use App\Models\Notification;
use Carbon\Carbon;

class CheckExpirations extends Command
{
    protected $signature   = 'expirations:check';
    protected $description = 'Check for expiring items and create notifications';

    public function handle(): int
    {
        $today       = Carbon::today();
        $expirations = Expiration::with('client')->get();
        $notifyCount = 0;

        foreach ($expirations as $expiration) {
            $expirationDate      = Carbon::parse($expiration->expiration_date);
            $daysUntilExpiration = (int) $today->diffInDays($expirationDate, false);

            // Skip already expired
            if ($daysUntilExpiration < 0) {
                continue;
            }

            $clientName = $expiration->client?->organization_name ?? 'Unknown Client';

            // ── Less than 7 days → notify EVERY DAY ──────────────────
            if ($daysUntilExpiration <= 7) {
                if ($this->createUrgentDailyNotification($expiration, $clientName, $daysUntilExpiration)) {
                    $notifyCount++;
                }
            }
            // ── Less than 30 days → notify ONCE ──────────────────────
            elseif ($daysUntilExpiration <= 30) {
                if ($this->createWarningNotificationOnce($expiration, $clientName, $daysUntilExpiration)) {
                    $notifyCount++;
                }
            }
        }

        $this->info("Done. {$notifyCount} new notification(s) created.");
        return 0;
    }

    // ---------------------------------------------------------------
    // Less than 7 days → new notification every day on login
    // Unique key: expiration title + client + today's date
    // ---------------------------------------------------------------
    private function createUrgentDailyNotification(
        Expiration $expiration,
        string $clientName,
        int $daysLeft
    ): bool {
        $dayText = $daysLeft === 1 ? 'day' : 'days';
        $prefix  = $daysLeft <= 3 ? '🔴 URGENT: ' : '⚠️ ';
        $message = "{$prefix}'{$expiration->title}' for {$clientName} is expiring in {$daysLeft} {$dayText}!";

        // Check if this exact message was already created today
        $alreadySentToday = Notification::where('message', $message)
            ->whereDate('created_at', Carbon::today())
            ->exists();

        if ($alreadySentToday) {
            return false;
        }

        Notification::create([
            'message' => $message,
            'is_read' => false,
        ]);

        return true;
    }

    // ---------------------------------------------------------------
    // Less than 30 days → notify only ONCE (never repeat)
    // Unique key: expiration title + client name in message
    // ---------------------------------------------------------------
    private function createWarningNotificationOnce(
        Expiration $expiration,
        string $clientName,
        int $daysLeft
    ): bool {
        // Use a fixed unique marker so it never duplicates regardless of daysLeft changing
        $uniqueMarker = "⏰ '{$expiration->title}' for {$clientName} is expiring in";

        // If any warning already exists for this expiration, skip
        $alreadyNotified = Notification::where('message', 'like', "{$uniqueMarker}%")
            ->exists();

        if ($alreadyNotified) {
            return false;
        }

        Notification::create([
            'message' => "{$uniqueMarker} {$daysLeft} days. Consider renewing soon.",
            'is_read' => false,
        ]);

        return true;
    }
}