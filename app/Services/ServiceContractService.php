<?php

namespace App\Services;

use App\Models\ServiceContract;
use App\Models\Notification;
use App\Models\UserLog;
use Carbon\Carbon;

class ServiceContractService
{
    /**
     * Check all service contracts for upcoming/near expiry and
     * create notifications following the tiered rule:
     * - daysLeft < 15 (milestone, once)
     * - daysLeft < 10 (milestone, once)
     * - daysLeft <= 7 (daily, repeats each day until expiry)
     */
    public function checkExpiringContracts(): void
    {
        $today     = Carbon::today();
        $contracts = ServiceContract::all();

        foreach ($contracts as $contract) {

            $daysLeft = (int) $today->diffInDays(
                Carbon::parse($contract->expiry_date),
                false
            );

            if ($daysLeft < 0) {
                continue; // already expired, skip
            }

            $clientName = $contract->customer_name ?: 'Unknown Client';

            if ($daysLeft <= 7) {
                $this->createDailyNotification($contract, $clientName, $daysLeft);
            } elseif (in_array($daysLeft, [10, 14])) {
                // 14 = the day it first crosses "< 15"
                // 10 = the day it first crosses "< 10" (well, hits 10)
                $this->createMilestoneNotification($contract, $clientName, $daysLeft);
            }
        }
    }

    private function createDailyNotification(
        ServiceContract $contract,
        string $clientName,
        int $daysLeft
    ): void {
        $today = Carbon::today()->toDateString();

        $alreadySent = Notification::where(
            'message', 'like',
            "%'{$contract->service_type}' contract for {$clientName}%"
        )
            ->where('message', 'like', "%expiring in {$daysLeft} day%")
            ->whereDate('created_at', $today)
            ->exists();

        if ($alreadySent) {
            return;
        }

        $dayText = $daysLeft === 1 ? 'day' : 'days';
        $urgency = $daysLeft <= 3 ? '🔴 URGENT: ' : '⚠️ ';

        Notification::create([
            'message' => "{$urgency}'{$contract->service_type}' contract for {$clientName} is expiring in {$daysLeft} {$dayText}!",
            'is_read' => false,
        ]);
    }

    private function createMilestoneNotification(
        ServiceContract $contract,
        string $clientName,
        int $daysLeft
    ): void {
        $alreadySent = Notification::where(
            'message', 'like',
            "%'{$contract->service_type}' contract for {$clientName}%"
        )
            ->where('message', 'like', "%expiring in {$daysLeft} days%")
            ->exists();

        if ($alreadySent) {
            return;
        }

        Notification::create([
            'message' => "⏰ '{$contract->service_type}' contract for {$clientName} is expiring in {$daysLeft} days. Consider renewing soon.",
            'is_read' => false,
        ]);
    }
}