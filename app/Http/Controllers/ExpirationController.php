<?php

namespace App\Http\Controllers;

use App\Models\Expiration;
use App\Models\Notification;
use Illuminate\Http\Request;
use Carbon\Carbon;

class ExpirationController extends Controller
{
    public function index()
    {
        $expirations = Expiration::with('client')->latest()->get();
        
        // Check for expiring items and create notifications
        $this->checkExpiringItems();
        
        return response()->json([
            'data' => $expirations,
            'message' => 'Expirations retrieved successfully'
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

        // Create notification for new expiration
        $this->createExpirationNotification($expiration, 'created');

        return response()->json([
            'message' => 'Expiration created successfully',
            'data' => $expiration->load('client'),
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

        // Create notification for updated expiration
        $this->createExpirationNotification($expiration, 'updated');

        return response()->json([
            'message' => 'Expiration updated successfully',
            'data' => $expiration->load('client'),
        ]);
    }

    public function destroy($id)
    {
        $expiration = Expiration::findOrFail($id);
        $expiration->delete();

        return response()->json([
            'message' => 'Expiration deleted successfully',
        ]);
    }

    /**
     * Create notification for expiration events
     */
    private function createExpirationNotification($expiration, $action)
    {
        $expiration->load('client');
        $clientName = $expiration->client ? $expiration->client->name : 'Unknown Client';
        
        $message = '';
        
        if ($action === 'created') {
            $message = "New expiration created: '{$expiration->title}' for {$clientName}. Expires on " . 
                       Carbon::parse($expiration->expiration_date)->format('M d, Y');
        } elseif ($action === 'updated') {
            $message = "Expiration updated: '{$expiration->title}' for {$clientName}. Expires on " . 
                       Carbon::parse($expiration->expiration_date)->format('M d, Y');
        }

        Notification::create([
            'message' => $message,
            'is_read' => false,
        ]);
    }

    /**
     * Check for expiring items and create notifications
     */
    private function checkExpiringItems()
    {
        $today = Carbon::today();
        $expirations = Expiration::with('client')->get();

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
                $this->createDailyNotification($expiration, $clientName, $daysUntilExpiration);
            }
            // Less than 1 month (30 days) - send notification once
            elseif ($daysUntilExpiration <= 30) {
                $this->createMonthlyNotification($expiration, $clientName, $daysUntilExpiration);
            }
        }
    }

    /**
     * Create daily notification for items expiring in 7 days or less
     */
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
        }
    }

    /**
     * Create notification for items expiring in less than a month
     */
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
        }
    }
}