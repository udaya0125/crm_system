<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FinanceTracking extends Model
{
    //
    protected $fillable = [
        'invoice_id',
        'client',
        'project',
        'invoice_date',
        'due_date',
        'amount',
        'paid_amount',
        'balance',
        'status',
    ];

    // protected static function boot()
    // {
    //     parent::boot();

    //     static::creating(function ($financeTracking) {
    //         $financeTracking->balance = ($financeTracking->amount ?? 0) - ($financeTracking->paid_amount ?? 0);
    //     });

    //     static::created(function ($financeTracking) {
    //         $financeTracking->invoice_id = 'INV-'.str_pad($financeTracking->id, 3, '0', STR_PAD_LEFT);
    //         $financeTracking->save();
    //     });

    //     static::updating(function ($financeTracking) {
    //         $financeTracking->balance = ($financeTracking->amount ?? 0) - ($financeTracking->paid_amount ?? 0);
    //     });
    // }
}