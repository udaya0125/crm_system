<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Expiration;
use App\Models\Notification;
use Carbon\Carbon;

class CheckExpirations extends Command
{
    protected $signature = 'expirations:check';
    protected $description = 'Check for expiring items and send notifications';

    public function handle()
    {
        $today = Carbon::today();
        $expirations = Expiration::with('client')->get();
        $notificationCount = 0;

        foreach ($expirations as $expiration) {
            $expirationDate = Carbon::parse($expiration->expiration_date);
            $daysUntilExpiration = $today->diffInDays($expirationDate, false);

            // Skip if already expired
            if ($daysUntilExpiration < 0) {
                continue;
            }

            $clientName = $expiration->client ? $expiration->client->name : 'Unknown Client';

            // Less than 7 days - send daily notification
            if ($daysUntilExpiration <= 7 && $daysUntilExpiration >= 0) {
                if ($this->createDailyNotification($expiration, $clientName, $daysUntilExpiration)) {
                    $notificationCount++;
                }
            }
            // Less than 1 month (30 days) - send notification once
            elseif ($daysUntilExpiration <= 30) {
                if ($this->createMonthlyNotification($expiration, $clientName, $daysUntilExpiration)) {
                    $notificationCount++;
                }
            }
        }

        $this->info("Checked expirations. Created {$notificationCount} notifications.");
        return 0;
    }

    private function createDailyNotification($expiration, $clientName, $daysLeft)
    {
        $today = Carbon::today()->format('Y-m-d');
        
        // Check if notification already sent today
        $existingNotification = Notification::where('message', 'like', "%'{$expiration->title}' for {$clientName}%")
            ->whereDate('created_at', $today)
            ->where('message', 'like', '%expiring in ' . $daysLeft . ' day%')
            ->first();

        if (!$existingNotification) {
            $dayText = $daysLeft === 1 ? 'day' : 'days';
            $urgency = $daysLeft <= 3 ? '🔴 URGENT: ' : '⚠️ ';
            
            $message = "{$urgency}'{$expiration->title}' for {$clientName} is expiring in {$daysLeft} {$dayText}!";
            
            Notification::create([
                'message' => $message,
                'is_read' => false,
            ]);

            return true;
        }

        return false;
    }

    private function createMonthlyNotification($expiration, $clientName, $daysLeft)
    {
        // Check if notification already sent for this expiration in the last 7 days
        $recentNotification = Notification::where('message', 'like', "%'{$expiration->title}' for {$clientName}%")
            ->where('created_at', '>=', Carbon::now()->subDays(7))
            ->where('message', 'like', '%expiring in%')
            ->first();

        if (!$recentNotification) {
            $message = "⏰ '{$expiration->title}' for {$clientName} is expiring in {$daysLeft} days. Consider renewing soon.";
            
            Notification::create([
                'message' => $message,
                'is_read' => false,
            ]);

            return true;
        }

        return false;
    }
}