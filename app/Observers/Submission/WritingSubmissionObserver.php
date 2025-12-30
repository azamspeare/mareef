<?php

declare(strict_types=1);

namespace App\Observers\Submission;

use App\Models\Submission\Writing\WritingSubmission;
use App\Repositories\MetricsRepository;
use App\Telegram\Messages\StudentSubmissionNotification;
use App\Telegram\Notifier;

final class WritingSubmissionObserver
{
    public function __construct(
        protected Notifier $notifier
    ) {
    }

    /**
     * Handle the WritingSubmission "created" event.
     */
    public function created(WritingSubmission $submission): void
    {
        $this->invalidateTeacherCache($submission);
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

        if ($submission->isCompleted() && $submission->isDirty('content')) {
            $teacher = $submission->writing->teacher;
            $telegramUser = $teacher->telegramUser;

            if (! $telegramUser) {
                return;
            }

            defer(fn () => $this->notifier->send($telegramUser->chat_id, new StudentSubmissionNotification($submission)));
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
