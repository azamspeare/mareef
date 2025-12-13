<?php

declare(strict_types=1);

namespace App\Mail\Writing;

use App\Models\Submission\WritingSubmission;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

final class StudentSubmissionNotification extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public WritingSubmission $submission
    ) {}

    public function envelope(): Envelope
    {
        $studentName = $this->submission->student->name;
        $taskTitle = $this->submission->writing->title;

        return new Envelope(
            subject: "{$studentName} just submitted: {$taskTitle}",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.student-submission',
            with: [
                'teacherName' => $this->submission->writing->teacher->name,
                'studentName' => $this->submission->student->name,
                'taskTitle' => $this->submission->writing->title,
                'submissionUrl' => route('submissions.show', ['id' => $this->submission->id]),
                'dashboardUrl' => route('dashboard'),
            ],
        );
    }
}
