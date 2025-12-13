<?php

declare(strict_types=1);

namespace App\Observers\Submission;

use App\Mail\Writing\StudentSubmissionNotification;
use App\Models\Submission\WritingSubmission;
use Illuminate\Support\Facades\Mail;

final class WritingSubmissionObserver
{
    /**
     * Handle the WritingSubmission "created" event.
     */
    public function created(WritingSubmission $submission): void
    {
        defer(function () use ($submission) {
            $email = $submission->writing->teacher->email;

            Mail::to($email)->send(new StudentSubmissionNotification($submission));
        });
    }

    /**
     * Handle the WritingSubmission "updated" event.
     */
    public function updated(WritingSubmission $submission): void
    {
        //
    }

    /**
     * Handle the WritingSubmission "deleted" event.
     */
    public function deleted(WritingSubmission $submission): void
    {
        //
    }

    /**
     * Handle the WritingSubmission "restored" event.
     */
    public function restored(WritingSubmission $submission): void
    {
        //
    }

    /**
     * Handle the WritingSubmission "force deleted" event.
     */
    public function forceDeleted(WritingSubmission $submission): void
    {
        //
    }
}
