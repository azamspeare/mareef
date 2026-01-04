<?php

declare(strict_types=1);

namespace App\Observers\Feedback;

use App\Models\Feedback\WritingFeedback;
use App\Telegram\Messages\Writing\WritingEvaluationNotification;
use App\Telegram\Notifier;

final class WritingFeedbackObserver
{
    public function __construct(
        protected Notifier $notifier
    ) {
    }

    /**
     * Handle the WritingFeedback "created" event.
     */
    public function created(WritingFeedback $feedback): void
    {
        $this->sendTelegramNotification($feedback, isUpdated: false);
    }

    /**
     * Handle the WritingFeedback "updated" event.
     */
    public function updated(WritingFeedback $feedback): void
    {
        $this->sendTelegramNotification($feedback, isUpdated: true);
    }

    private function sendTelegramNotification(WritingFeedback $feedback, bool $isUpdated): void
    {
        $student = $feedback->submission->student;
        $telegramUser = $student->telegramUser;

        if (! $telegramUser) {
            return;
        }

        defer(fn () => $this->notifier->send($telegramUser->chat_id, new WritingEvaluationNotification($feedback, $isUpdated)));
    }
}
