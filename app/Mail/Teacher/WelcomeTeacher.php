<?php

declare(strict_types=1);

namespace App\Mail\Teacher;

use App\Models\User\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

final class WelcomeTeacher extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public User $teacher
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Welcome to Mareef — let's simplify student writing",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.welcome-teacher',
            with: [
                'teacherName' => $this->teacher->name,
                'createTaskUrl' => route('writings.create'),
                'dashboardUrl' => route('dashboard'),
            ],
        );
    }
}
