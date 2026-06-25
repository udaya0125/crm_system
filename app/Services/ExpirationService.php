<?php

namespace App\Services;

use App\Models\Expiration;
use App\Models\Notification;
use App\Models\UserLog;
use Carbon\Carbon;
use Illuminate\Http\Request;

class ExpirationService
{
    public function store(array $data, Request $request): Expiration
    {
        $expiration = Expiration::create($data);

        $expiration->load('client');

        $this->createExpirationNotification($expiration, 'created');

        $clientName = $expiration->client?->name ?? 'Unknown Client';

        $this->createUserLog(
            "Expiration Created for {$clientName}",
            $request
        );

        return $expiration;
    }

    public function update(Expiration $expiration, array $data, Request $request): Expiration
    {
        $expiration->update($data);

        $expiration->load('client');

        $this->createExpirationNotification($expiration, 'updated');

        $clientName = $expiration->client?->name ?? 'Unknown Client';

        $this->createUserLog(
            "Expiration Updated for {$clientName}",
            $request
        );

        return $expiration;
    }

    public function delete(Expiration $expiration, Request $request): void
    {
        $clientName = $expiration->client?->name ?? 'Unknown Client';

        $expiration->delete();

        $this->createUserLog(
            "Expiration Deleted for {$clientName}",
            $request
        );
    }

    public function checkExpiringItems(): void
    {
        $today = Carbon::today();

        $expirations = Expiration::with('client')->get();

        foreach ($expirations as $expiration) {

            $daysLeft = (int) $today->diffInDays(
                Carbon::parse($expiration->expiration_date),
                false
            );

            $clientName = $expiration->client?->name ?? 'Unknown Client';

            if ($daysLeft < 0) {
                continue;
            }

            if ($daysLeft <= 15) {
                $this->createDailyNotification(
                    $expiration,
                    $clientName,
                    $daysLeft
                );
            } elseif (in_array($daysLeft, [20, 25, 30, 45])) {
                $this->createMilestoneNotification(
                    $expiration,
                    $clientName,
                    $daysLeft
                );
            }
        }
    }

    private function createExpirationNotification(
        Expiration $expiration,
        string $action
    ): void {

        $clientName = $expiration->client?->name ?? 'Unknown Client';

        $message = match ($action) {
            'created' =>
                "New expiration created: '{$expiration->title}' for {$clientName}. Expires on " .
                Carbon::parse($expiration->expiration_date)->format('M d, Y'),

            'updated' =>
                "Expiration updated: '{$expiration->title}' for {$clientName}. Expires on " .
                Carbon::parse($expiration->expiration_date)->format('M d, Y'),

            default => '',
        };

        if ($message) {
            Notification::create([
                'message' => $message,
                'is_read' => false,
            ]);
        }
    }

    private function createDailyNotification(
        Expiration $expiration,
        string $clientName,
        int $daysLeft
    ): void {

        $today = Carbon::today()->toDateString();

        $alreadySent = Notification::where(
            'message',
            'like',
            "%'{$expiration->title}' for {$clientName}%"
        )
            ->where(
                'message',
                'like',
                "%expiring in {$daysLeft} day%"
            )
            ->whereDate('created_at', $today)
            ->exists();

        if (!$alreadySent) {

            $dayText = $daysLeft === 1 ? 'day' : 'days';

            $urgency = $daysLeft <= 3
                ? '🔴 URGENT: '
                : '⚠️ ';

            Notification::create([
                'message' =>
                    "{$urgency}'{$expiration->title}' for {$clientName} is expiring in {$daysLeft} {$dayText}!",
                'is_read' => false,
            ]);
        }
    }

    private function createMilestoneNotification(
        Expiration $expiration,
        string $clientName,
        int $daysLeft
    ): void {

        $alreadySent = Notification::where(
            'message',
            'like',
            "%'{$expiration->title}' for {$clientName}%"
        )
            ->where(
                'message',
                'like',
                "%expiring in {$daysLeft} days%"
            )
            ->exists();

        if (!$alreadySent) {
            Notification::create([
                'message' =>
                    "⏰ '{$expiration->title}' for {$clientName} is expiring in {$daysLeft} days. Consider renewing soon.",
                'is_read' => false,
            ]);
        }
    }

    private function createUserLog(
        string $title,
        Request $request
    ): void {

        UserLog::create([
            'name' => $request->user()?->name ?? 'System',
            'ip_address' => $request->ip(),
            'title' => $title,
        ]);
    }
}