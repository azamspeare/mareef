<?php

declare(strict_types=1);

namespace App\Telegram\Messages\Quiz;

use App\Contracts\Abstracts\Telegram\TelegramMessage;
use App\Models\Submission\Quiz\QuizSubmission;

final class QuizFeedbackNotification extends TelegramMessage
{
    public function __construct(
        protected readonly QuizSubmission $submission,
        protected readonly bool $isUpdated = false
    ) {
    }

    public function toText(): string
    {
        $quiz = $this->submission->quiz;
        $taskTitle = $quiz->title;
        $teacherName = $quiz->teacher->name;

        $url = route('student.tasks.quiz', [
            'handle' => $quiz->teacher->username,
            'slug' => $quiz->slug,
        ]);

        $header = $this->isUpdated
            ? '♻️ Your feedback has been updated'
            : '✅ Your quiz has been reviewed.';

        return <<<TEXT
        {$header}

        📘 Quiz: <b>{$taskTitle}</b>
        👤 Teacher: <b>{$teacherName}</b>

        Your feedback and score are now available.

        <a href="{$url}">View Quiz Feedback</a>
        TEXT;
    }
}
