<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class InterviewScheduledMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public $candidateName;
    public $jobTitle;
    public $interviewDate;
    public $interviewTime;
    public $employerEmail;

    public function __construct($candidateName, $jobTitle, $interviewDate, $interviewTime, $employerEmail)
    {
        $this->candidateName = $candidateName;
        $this->jobTitle = $jobTitle;
        $this->interviewDate = $interviewDate;
        $this->interviewTime = $interviewTime;
        $this->employerEmail = $employerEmail;
    }

    /**
     * Get the message envelope.
     */


    /**
     * Get the message content definition.
     */
    public function build()
    {
        return $this->subject('Your Interview is Scheduled')
            ->view('emails.interview_scheduled');
    }


    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
