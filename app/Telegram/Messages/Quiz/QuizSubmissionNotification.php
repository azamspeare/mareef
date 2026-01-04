<?php

declare(strict_types=1);

namespace App\Telegram\Messages\Quiz;

use App\Contracts\Abstracts\Telegram\TelegramMessage;
use App\Models\Submission\Quiz\QuizSubmission;

final class QuizSubmissionNotification extends TelegramMessage
{
    public function __construct(
        protected readonly QuizSubmission $submission
    ) {
    }

    public function toText(): string
    {
        $studentName = $this->submission->student->name;
        $taskTitle = $this->submission->quiz->title;
        $url = route('quizzes.submissions.show', ['id' => $this->submission->id]);

        return <<<TEXT
        📩 New submission received.

        👤 Student: <b>{$studentName}</b>
        📘 Quiz: <b>{$taskTitle}</b>

        You can review and give feedback on it in your dashboard.

        <a href="{$url}">View Quiz Submission</a>
        TEXT;
    }
}
