<?php

declare(strict_types=1);

namespace App\Telegram\Messages;

use App\Contracts\Abstracts\Telegram\TelegramMessage;
use App\Models\Feedback\WritingFeedback;

final class TeacherEvaluationNotification extends TelegramMessage
{
    public function __construct(
        protected readonly WritingFeedback $feedback,
        protected readonly bool $isUpdated = false
    ) {
    }

    public function toText(): string
    {
        $writing = $this->feedback->submission->writing;
        $taskTitle = $writing->title;
        $teacherName = $writing->teacher->name;

        $url = route('student.tasks.writing', [
            'handle' => $writing->teacher->username,
            'slug' => $writing->slug,
        ]);

        $header = $this->isUpdated
            ? '♻️ Your feedback has been updated'
            : '✅ Your task has been reviewed.';

        return <<<TEXT
        {$header}

        📘 Task: <b>{$taskTitle}</b>
        👤 Teacher: <b>{$teacherName}</b>

        Your feedback and score are now available.

        <a href="{$url}">View Feedback</a>
        TEXT;
    }
}
