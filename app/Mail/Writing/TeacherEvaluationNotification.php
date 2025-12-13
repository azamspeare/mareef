<?php

declare(strict_types=1);

namespace App\Mail\Writing;

use App\Models\Feedback\WritingFeedback;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

final class TeacherEvaluationNotification extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public WritingFeedback $feedback,
        public bool $isUpdated = false
    ) {}

    public function envelope(): Envelope
    {
        $taskTitle = $this->feedback->submission->writing->title;
        $subject = $this->isUpdated
            ? "Your feedback has been updated: {$taskTitle}"
            : "Your task has been reviewed: {$taskTitle}";

        return new Envelope(
            subject: $subject,
        );
    }

    public function content(): Content
    {
        $writing = $this->feedback->submission->writing;

        return new Content(
            view: 'emails.teacher-evaluation',
            with: [
                'studentName' => $this->feedback->submission->student->name,
                'teacherName' => $writing->teacher->name,
                'taskTitle' => $writing->title,
                'isUpdated' => $this->isUpdated,
                'feedbackUrl' => route('tasks.writing', [
                    'handle' => $writing->teacher->username,
                    'slug' => $writing->slug,
                ]),
            ],
        );
    }
}
