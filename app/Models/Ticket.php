<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    //
    protected $fillable = [
        'ticket_id',
        'client_name',
        'issue_type',
        'device_type',
        'problem_description',
        'priority',
        'assigned_technician',
        'status',
        'email',
        'image'
    ];

    protected static function boot()
    {
        parent::boot();

        static::created(function ($ticket) {
            $ticket->ticket_id = 'TCK-'.str_pad($ticket->id, 3, '0', STR_PAD_LEFT);
            $ticket->save();
        });
    }

    // 🔹 Relation with User
    public function assignedUser()
    {
        return $this->belongsTo(User::class, 'assigned_technician');
    }
}
