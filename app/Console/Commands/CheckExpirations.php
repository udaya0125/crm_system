<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Expiration;
use App\Models\DomainManagement;
use App\Models\HostingManagement;
use App\Models\Notification;
use App\Models\UserLog;
use Carbon\Carbon;

class CheckExpirations extends Command
{
    protected $signature   = 'expirations:check';
    protected $description = 'Check expiring items (expirations, domains, hostings) and create notifications + logs';

    public function handle(): int
    {
        $total = 0;
        $total += $this->processExpirations();
        $total += $this->processDomains();
        $total += $this->processHostings();

        $this->info("Done. {$total} new notification(s)/log(s) created.");
        return 0;
    }

    // =========================================================================
    //  EXPIRATIONS
    // =========================================================================

    private function processExpirations(): int
    {
        $count       = 0;
        $today       = Carbon::today();
        $expirations = Expiration::with('client')->get();

        foreach ($expirations as $expiration) {
            $daysLeft   = (int) $today->diffInDays(Carbon::parse($expiration->expiration_date), false);
            $clientName = $expiration->client?->name ?? 'Unknown Client';

            if ($daysLeft < 0) continue;

            if ($daysLeft <= 15) {
                if ($this->createDailyNotification(
                    subject:    "'{$expiration->title}'",
                    clientName: $clientName,
                    daysLeft:   $daysLeft,
                    context:    'expiring'
                )) $count++;

                if ($this->createDailyLog(
                    subject:    "Expiration '{$expiration->title}'",
                    clientName: $clientName,
                    daysLeft:   $daysLeft,
                    context:    'expiring'
                )) $count++;

            } elseif (in_array($daysLeft, [20, 25, 30, 45])) {
                if ($this->createMilestoneNotification(
                    subject:    "'{$expiration->title}'",
                    clientName: $clientName,
                    daysLeft:   $daysLeft,
                    context:    'expiring'
                )) $count++;

                if ($this->createMilestoneLog(
                    subject:    "Expiration '{$expiration->title}'",
                    clientName: $clientName,
                    daysLeft:   $daysLeft,
                    context:    'expiring'
                )) $count++;
            }
        }

        $this->line("  Expirations: {$count} entries created.");
        return $count;
    }

    // =========================================================================
    //  DOMAINS
    // =========================================================================

    private function processDomains(): int
    {
        $count   = 0;
        $today   = Carbon::today();
        $domains = DomainManagement::with('client')->get();

        foreach ($domains as $domain) {
            $daysLeft   = (int) $today->diffInDays(Carbon::parse($domain->expiry_date), false);
            $clientName = $domain->client?->name ?? 'Unknown Client';

            if ($daysLeft < 0) continue;

            if ($daysLeft <= 15) {
                if ($this->createDailyNotification(
                    subject:    "Domain '{$domain->domain_name}'",
                    clientName: $clientName,
                    daysLeft:   $daysLeft,
                    context:    'expiring'
                )) $count++;

                if ($this->createDailyLog(
                    subject:    "Domain '{$domain->domain_name}'",
                    clientName: $clientName,
                    daysLeft:   $daysLeft,
                    context:    'expiring'
                )) $count++;

            } elseif (in_array($daysLeft, [20, 25, 30, 45])) {
                if ($this->createMilestoneNotification(
                    subject:    "Domain '{$domain->domain_name}'",
                    clientName: $clientName,
                    daysLeft:   $daysLeft,
                    context:    'expiring'
                )) $count++;

                if ($this->createMilestoneLog(
                    subject:    "Domain '{$domain->domain_name}'",
                    clientName: $clientName,
                    daysLeft:   $daysLeft,
                    context:    'expiring'
                )) $count++;
            }
        }

        $this->line("  Domains: {$count} entries created.");
        return $count;
    }

    // =========================================================================
    //  HOSTINGS
    // =========================================================================

    private function processHostings(): int
    {
        $count    = 0;
        $today    = Carbon::today();
        $hostings = HostingManagement::with('client')->get();

        foreach ($hostings as $hosting) {
            $daysLeft   = (int) $today->diffInDays(Carbon::parse($hosting->renewal_date), false);
            $clientName = $hosting->client?->name ?? 'Unknown Client';

            if ($daysLeft < 0) continue;

            if ($daysLeft <= 15) {
                if ($this->createDailyNotification(
                    subject:    "Hosting '{$hosting->hosting_plan}'",
                    clientName: $clientName,
                    daysLeft:   $daysLeft,
                    context:    'due for renewal'
                )) $count++;

                if ($this->createDailyLog(
                    subject:    "Hosting '{$hosting->hosting_plan}'",
                    clientName: $clientName,
                    daysLeft:   $daysLeft,
                    context:    'due for renewal'
                )) $count++;

            } elseif (in_array($daysLeft, [20, 25, 30, 45])) {
                if ($this->createMilestoneNotification(
                    subject:    "Hosting '{$hosting->hosting_plan}'",
                    clientName: $clientName,
                    daysLeft:   $daysLeft,
                    context:    'due for renewal'
                )) $count++;

                if ($this->createMilestoneLog(
                    subject:    "Hosting '{$hosting->hosting_plan}'",
                    clientName: $clientName,
                    daysLeft:   $daysLeft,
                    context:    'due for renewal'
                )) $count++;
            }
        }

        $this->line("  Hostings: {$count} entries created.");
        return $count;
    }

    // =========================================================================
    //  SHARED NOTIFICATION HELPERS
    // =========================================================================

    private function createDailyNotification(
        string $subject,
        string $clientName,
        int    $daysLeft,
        string $context
    ): bool {
        $dayText = $daysLeft === 1 ? 'day' : 'days';
        $urgency = $daysLeft <= 3 ? '🔴 URGENT: ' : '⚠️ ';
        $message = "{$urgency}{$subject} for {$clientName} is {$context} in {$daysLeft} {$dayText}!";

        $exists = Notification::where('message', $message)
            ->whereDate('created_at', Carbon::today())
            ->exists();

        if ($exists) return false;

        Notification::create(['message' => $message, 'is_read' => false]);
        return true;
    }

    private function createMilestoneNotification(
        string $subject,
        string $clientName,
        int    $daysLeft,
        string $context
    ): bool {
        $message = "⏰ {$subject} for {$clientName} is {$context} in {$daysLeft} days. Consider renewing soon.";

        $exists = Notification::where('message', $message)->exists();

        if ($exists) return false;

        Notification::create(['message' => $message, 'is_read' => false]);
        return true;
    }

    // =========================================================================
    //  SHARED USER LOG HELPERS
    // =========================================================================

    private function createDailyLog(
        string $subject,
        string $clientName,
        int    $daysLeft,
        string $context
    ): bool {
        $dayText = $daysLeft === 1 ? 'day' : 'days';
        $urgency = $daysLeft <= 3 ? '[URGENT] ' : '[WARNING] ';
        $title   = "{$urgency}{$subject} for {$clientName} is {$context} in {$daysLeft} {$dayText}!";

        $exists = UserLog::where('title', $title)
            ->whereDate('created_at', Carbon::today())
            ->exists();

        if ($exists) return false;

        UserLog::create([
            'name'       => 'System',
            'ip_address' => '127.0.0.1',
            'title'      => $title,
        ]);
        return true;
    }

    private function createMilestoneLog(
        string $subject,
        string $clientName,
        int    $daysLeft,
        string $context
    ): bool {
        $title = "[REMINDER] {$subject} for {$clientName} is {$context} in {$daysLeft} days. Consider renewing soon.";

        $exists = UserLog::where('title', $title)->exists();

        if ($exists) return false;

        UserLog::create([
            'name'       => 'System',
            'ip_address' => '127.0.0.1',
            'title'      => $title,
        ]);
        return true;
    }
}