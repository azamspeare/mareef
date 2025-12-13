<?php

declare(strict_types=1);

namespace App\Observers\Feedback;

use App\Mail\Writing\TeacherEvaluationNotification;
use App\Models\Feedback\WritingFeedback;
use Illuminate\Support\Facades\Mail;

final class WritingFeedbackObserver
{
    /**
     * Handle the WritingFeedback "created" event.
     */
    public function created(WritingFeedback $feedback): void
    {
        defer(function () use ($feedback) {
            $email = $feedback->submission->student->email;

            Mail::to($email)->send(new TeacherEvaluationNotification($feedback));
        });
    }

    /**
     * Handle the WritingFeedback "updated" event.
     */
    public function updated(WritingFeedback $feedback): void
    {
        defer(function () use ($feedback) {
            $email = $feedback->submission->student->email;

            Mail::to($email)->send(new TeacherEvaluationNotification($feedback, true));
        });
    }

    /**
     * Handle the WritingFeedback "deleted" event.
     */
    public function deleted(WritingFeedback $feedback): void
    {
        //
    }

    /**
     * Handle the WritingFeedback "restored" event.
     */
    public function restored(WritingFeedback $feedback): void
    {
        //
    }

    /**
     * Handle the WritingFeedback "force deleted" event.
     */
    public function forceDeleted(WritingFeedback $feedback): void
    {
        //
    }
}
