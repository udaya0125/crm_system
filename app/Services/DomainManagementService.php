<?php

namespace App\Services;

use App\Models\DomainManagement;
use App\Models\Notification;
use App\Models\UserLog;
use Carbon\Carbon;
use Illuminate\Http\Request;

class DomainManagementService
{
    public function getAllDomains()
    {
        $domains = DomainManagement::with('client')->latest()->get();

        $this->checkExpiringDomains();

        return $domains;
    }

    public function createDomain(array $data, Request $request)
    {
        $domain = DomainManagement::create($data);

        $domain->load('client');

        $clientName = $domain->client?->name ?? 'Unknown Client';

        Notification::create([
            'message' => "New domain created: '{$domain->domain_name}' for {$clientName}. Expires on ".
                Carbon::parse($domain->expiry_date)->format('M d, Y'),
            'is_read' => false,
        ]);

        $this->createUserLog(
            'Domain Created',
            "Created domain '{$domain->domain_name}' for {$clientName}. Expires on ".
            Carbon::parse($domain->expiry_date)->format('M d, Y'),
            $request
        );

        return $domain;
    }

    public function updateDomain(int $id, array $data, Request $request)
    {
        $domain = DomainManagement::findOrFail($id);

        $domain->update($data);

        $domain->load('client');

        $clientName = $domain->client?->name ?? 'Unknown Client';

        Notification::create([
            'message' => "Domain updated: '{$domain->domain_name}' for {$clientName}. Expires on ".
                Carbon::parse($domain->expiry_date)->format('M d, Y'),
            'is_read' => false,
        ]);

        $this->createUserLog(
            'Domain Updated',
            "Updated domain '{$domain->domain_name}' for {$clientName}. Expires on ".
            Carbon::parse($domain->expiry_date)->format('M d, Y'),
            $request
        );

        return $domain;
    }

    public function deleteDomain(int $id, Request $request)
    {
        $domain = DomainManagement::with('client')->findOrFail($id);

        $clientName = $domain->client?->name ?? 'Unknown Client';
        $domainName = $domain->domain_name;

        $domain->delete();

        $this->createUserLog(
            'Domain Deleted',
            "Deleted domain '{$domainName}' for {$clientName}.",
            $request
        );

        return true;
    }

    private function createUserLog(string $title, string $detail, Request $request): void
    {
        UserLog::create([
            'name' => $request->user()?->name ?? 'System',
            'ip_address' => $request->ip(),
            'title' => "[{$title}] {$detail}",
        ]);
    }

    private function checkExpiringDomains(): void
    {
        $today = Carbon::today();

        $domains = DomainManagement::with('client')->get();

        foreach ($domains as $domain) {

            $daysLeft = (int) $today->diffInDays(
                Carbon::parse($domain->expiry_date),
                false
            );

            if ($daysLeft < 0) {
                continue;
            }

            $clientName = $domain->client?->name ?? 'Unknown Client';

            if ($daysLeft <= 15) {

                $exists = Notification::where(
                    'message',
                    'like',
                    "%{$domain->domain_name}%"
                )
                    ->whereDate('created_at', today())
                    ->exists();

                if (! $exists) {

                    Notification::create([
                        'message' => "⚠️ Domain '{$domain->domain_name}' for {$clientName} is expiring in {$daysLeft} days.",
                        'is_read' => false,
                    ]);

                    UserLog::create([
                        'name' => 'System',
                        'ip_address' => request()->ip(),
                        'title' => "[WARNING] Domain '{$domain->domain_name}' for {$clientName} is expiring in {$daysLeft} days.",
                    ]);
                }
            }
        }
    }
}
