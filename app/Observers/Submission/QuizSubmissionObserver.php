<?php

declare(strict_types=1);

namespace App\Observers\Submission;

use App\Models\Submission\Quiz\QuizSubmission;
use App\Repositories\MetricsRepository;
use App\Telegram\Messages\Quiz\QuizFeedbackNotification;
use App\Telegram\Messages\Quiz\QuizSubmissionNotification;
use App\Telegram\Notifier;

final class QuizSubmissionObserver
{
    public function __construct(
        protected Notifier $notifier
    ) {
    }

    /**
     * Handle the QuizSubmission "created" event.
     */
    public function created(QuizSubmission $submission): void
    {
        $this->invalidateTeacherCache($submission);
    }

    /**
     * Handle the QuizSubmission "updated" event.
     */
    public function updated(QuizSubmission $submission): void
    {
        // Only invalidate cache if evaluation status changed
        if ($submission->isDirty('evaluated_at') || $submission->isDirty('status')) {
            $this->invalidateTeacherCache($submission);
        }

        if ($submission->isCompleted() && blank($submission->evaluated_at) && blank($submission->feedback)) {
            $teacher = $submission->quiz->teacher;
            $telegramUser = $teacher->telegramUser;

            if (! $telegramUser) {
                return;
            }

            defer(fn () => $this->notifier->send($telegramUser->chat_id, new QuizSubmissionNotification($submission)));
            return;
        }

        if ($submission->isDirty('feedback') && $submission->wasChanged('evaluated_at')) {
            $student = $submission->student;
            $telegramUser = $student->telegramUser;

            if (! $telegramUser) {
                return;
            }

            defer(fn () => $this->notifier->send($telegramUser->chat_id, new QuizFeedbackNotification($submission)));
        }
    }

    /**
     * Handle the QuizSubmission "deleted" event.
     */
    public function deleted(QuizSubmission $submission): void
    {
        $this->invalidateTeacherCache($submission);
    }

    /**
     * Handle the QuizSubmission "restored" event.
     */
    public function restored(QuizSubmission $submission): void
    {
        $this->invalidateTeacherCache($submission);
    }

    /**
     * Handle the QuizSubmission "force deleted" event.
     */
    public function forceDeleted(QuizSubmission $submission): void
    {
        $this->invalidateTeacherCache($submission);
    }

    /**
     * Invalidate the teacher's metrics and counts cache.
     */
    private function invalidateTeacherCache(QuizSubmission $submission): void
    {
        $teacherId = $submission->quiz->teacher_id;
        MetricsRepository::invalidateCache($teacherId);
    }
}
