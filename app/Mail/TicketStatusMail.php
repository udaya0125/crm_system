<?php

namespace App\Mail;

use App\Models\Ticket;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class TicketStatusMail extends Mailable
{
    use Queueable, SerializesModels;

    public Ticket $ticket;
    public User $recipient;
    public string $mailType; // 'client' or 'technician'

    /**
     * Create a new message instance.
     */
    public function __construct(Ticket $ticket, User $recipient, string $mailType = 'client')
    {
        $this->ticket    = $ticket;
        $this->recipient = $recipient;
        $this->mailType  = $mailType;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $subject = match($this->mailType) {
            'technician' => "New Ticket Assigned: {$this->ticket->ticket_id}",
            'admin'      => "New Ticket Submitted: {$this->ticket->ticket_id} — {$this->ticket->client_name}",
            default      => "Your Ticket {$this->ticket->ticket_id} Has Been Updated",
        };

        return new Envelope(subject: $subject);
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.ticket-status',
        );
    }

    /**
     * Get the attachments for the message.
     */
    public function attachments(): array
    {
        return [];
    }
}