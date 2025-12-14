<?php

declare(strict_types=1);

namespace App\Observers\Submission;

use App\Mail\Writing\StudentSubmissionNotification;
use App\Models\Submission\WritingSubmission;
use App\Repositories\MetricsRepository;
use Illuminate\Support\Facades\Mail;

final class WritingSubmissionObserver
{
    /**
     * Handle the WritingSubmission "created" event.
     */
    public function created(WritingSubmission $submission): void
    {
        // Invalidate metrics cache for the teacher
        $this->invalidateTeacherCache($submission);

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
        // Only invalidate cache if evaluation status changed
        if ($submission->isDirty('evaluated_at') || $submission->isDirty('status')) {
            $this->invalidateTeacherCache($submission);
        }
    }

    /**
     * Handle the WritingSubmission "deleted" event.
     */
    public function deleted(WritingSubmission $submission): void
    {
        $this->invalidateTeacherCache($submission);
    }

    /**
     * Handle the WritingSubmission "restored" event.
     */
    public function restored(WritingSubmission $submission): void
    {
        $this->invalidateTeacherCache($submission);
    }

    /**
     * Handle the WritingSubmission "force deleted" event.
     */
    public function forceDeleted(WritingSubmission $submission): void
    {
        $this->invalidateTeacherCache($submission);
    }

    /**
     * Invalidate the teacher's metrics and counts cache.
     */
    private function invalidateTeacherCache(WritingSubmission $submission): void
    {
        $teacherId = $submission->writing->teacher_id;
        MetricsRepository::invalidateCache($teacherId);
    }
}
