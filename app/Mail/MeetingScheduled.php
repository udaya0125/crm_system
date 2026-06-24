<?php

namespace App\Mail;

use App\Models\Lead;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class MeetingScheduled extends Mailable
{
    use Queueable, SerializesModels;

    public Lead $lead;
    public string $mailType; // 'created' or 'updated'

    /**
     * Create a new message instance.
     */
    public function __construct(Lead $lead, string $mailType = 'created')
    {
        $this->lead     = $lead;
        $this->mailType = $mailType;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $subject = $this->mailType === 'created'
            ? "New Lead Added: {$this->lead->client_name}"
            : "Lead Updated: {$this->lead->client_name}";

        return new Envelope(subject: $subject);
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.meeting-scheduled',
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