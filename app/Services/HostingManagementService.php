<?php

namespace App\Services;

use App\Models\HostingManagement;
use App\Models\Notification;
use App\Models\UserLog;
use Carbon\Carbon;
use Illuminate\Http\Request;

class HostingManagementService
{
    public function getAll()
    {
        return HostingManagement::with('client')->latest()->get();
    }

    public function create(array $data, Request $request)
    {
        $hosting = HostingManagement::create($data);
        $hosting->load('client');

        $clientName = $hosting->client?->name ?? 'Unknown Client';

        Notification::create([
            'message' => "New hosting created: '{$hosting->hosting_plan}' for {$clientName}. Renews on " .
                Carbon::parse($hosting->renewal_date)->format('M d, Y'),
            'is_read' => false,
        ]);

        $this->createUserLog(
            'Hosting Created',
            "Created hosting '{$hosting->hosting_plan}' for {$clientName}. Renews on " .
                Carbon::parse($hosting->renewal_date)->format('M d, Y'),
            $request
        );

        return $hosting;
    }

    public function update(HostingManagement $hosting, array $data, Request $request)
    {
        $hosting->update($data);
        $hosting->load('client');

        $clientName = $hosting->client?->name ?? 'Unknown Client';

        Notification::create([
            'message' => "Hosting updated: '{$hosting->hosting_plan}' for {$clientName}. Renews on " .
                Carbon::parse($hosting->renewal_date)->format('M d, Y'),
            'is_read' => false,
        ]);

        $this->createUserLog(
            'Hosting Updated',
            "Updated hosting '{$hosting->hosting_plan}' for {$clientName}. Renews on " .
                Carbon::parse($hosting->renewal_date)->format('M d, Y'),
            $request
        );

        return $hosting;
    }

    public function delete(HostingManagement $hosting, Request $request)
    {
        $clientName = $hosting->client?->name ?? 'Unknown Client';
        $hostingPlan = $hosting->hosting_plan;

        $hosting->delete();

        $this->createUserLog(
            'Hosting Deleted',
            "Deleted hosting '{$hostingPlan}' for {$clientName}.",
            $request
        );

        return true;
    }

    public function checkExpiringHostings()
    {
        $today = Carbon::today();

        $hostings = HostingManagement::with('client')->get();

        foreach ($hostings as $hosting) {

            $daysLeft = (int) $today->diffInDays(
                Carbon::parse($hosting->renewal_date),
                false
            );

            $clientName = $hosting->client?->name ?? 'Unknown Client';

            if ($daysLeft < 0) {
                continue;
            }

            if ($daysLeft <= 15) {
                $this->createDailyNotification(
                    $hosting,
                    $clientName,
                    $daysLeft
                );

                $this->createDailyLog(
                    $hosting,
                    $clientName,
                    $daysLeft
                );
            } elseif (in_array($daysLeft, [20, 25, 30, 45])) {
                $this->createMilestoneNotification(
                    $hosting,
                    $clientName,
                    $daysLeft
                );

                $this->createMilestoneLog(
                    $hosting,
                    $clientName,
                    $daysLeft
                );
            }
        }
    }

    private function createDailyNotification($hosting, string $clientName, int $daysLeft)
    {
        $today = Carbon::today()->toDateString();

        $dayText = $daysLeft === 1 ? 'day' : 'days';

        $alreadySent = Notification::where(
            'message',
            'like',
            "%'{$hosting->hosting_plan}' for {$clientName}%"
        )
        ->where(
            'message',
            'like',
            "%renewal in {$daysLeft} {$dayText}%"
        )
        ->whereDate('created_at', $today)
        ->exists();

        if (!$alreadySent) {

            $urgency = $daysLeft <= 3
                ? '🔴 URGENT: '
                : '⚠️ ';

            Notification::create([
                'message' => "{$urgency}Hosting '{$hosting->hosting_plan}' for {$clientName} is due for renewal in {$daysLeft} {$dayText}!",
                'is_read' => false,
            ]);
        }
    }

    private function createMilestoneNotification($hosting, string $clientName, int $daysLeft)
    {
        $alreadySent = Notification::where(
            'message',
            'like',
            "%'{$hosting->hosting_plan}' for {$clientName}%"
        )
        ->where(
            'message',
            'like',
            "%renewal in {$daysLeft} days%"
        )
        ->exists();

        if (!$alreadySent) {
            Notification::create([
                'message' => "⏰ Hosting '{$hosting->hosting_plan}' for {$clientName} is due for renewal in {$daysLeft} days. Consider renewing soon.",
                'is_read' => false,
            ]);
        }
    }

    private function createDailyLog($hosting, string $clientName, int $daysLeft)
    {
        $today = Carbon::today()->toDateString();

        $dayText = $daysLeft === 1 ? 'day' : 'days';

        $urgency = $daysLeft <= 3
            ? '[URGENT] '
            : '[WARNING] ';

        $entry = "{$urgency}Hosting '{$hosting->hosting_plan}' for {$clientName} is due for renewal in {$daysLeft} {$dayText}!";

        $alreadyLogged = UserLog::where(
            'title',
            'like',
            "%'{$hosting->hosting_plan}' for {$clientName}%"
        )
        ->where(
            'title',
            'like',
            "%renewal in {$daysLeft} {$dayText}%"
        )
        ->whereDate('created_at', $today)
        ->exists();

        if (!$alreadyLogged) {
            UserLog::create([
                'name' => 'System',
                'ip_address' => request()->ip(),
                'title' => $entry,
            ]);
        }
    }

    private function createMilestoneLog($hosting, string $clientName, int $daysLeft)
    {
        $entry = "[REMINDER] Hosting '{$hosting->hosting_plan}' for {$clientName} is due for renewal in {$daysLeft} days. Consider renewing soon.";

        $alreadyLogged = UserLog::where(
            'title',
            'like',
            "%'{$hosting->hosting_plan}' for {$clientName}%"
        )
        ->where(
            'title',
            'like',
            "%renewal in {$daysLeft} days%"
        )
        ->exists();

        if (!$alreadyLogged) {
            UserLog::create([
                'name' => 'System',
                'ip_address' => request()->ip(),
                'title' => $entry,
            ]);
        }
    }

    private function createUserLog(
        string $title,
        string $detail,
        Request $request
    ) {
        UserLog::create([
            'name' => $request->user()?->name ?? 'System',
            'ip_address' => $request->ip(),
            'title' => "[{$title}] {$detail}",
        ]);
    }
}