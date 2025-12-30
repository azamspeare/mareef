<?php

declare(strict_types=1);

namespace App\Telegram\Messages;

use App\Contracts\Abstracts\Telegram\TelegramMessage;
use App\Models\Submission\Writing\WritingSubmission;

final class StudentSubmissionNotification extends TelegramMessage
{
    public function __construct(
        protected readonly WritingSubmission $submission
    ) {
    }

    public function toText(): string
    {
        $studentName = $this->submission->student->name;
        $taskTitle = $this->submission->writing->title;
        $url = route('submissions.show', ['id' => $this->submission->id]);

        return <<<TEXT
        📩 New submission received.

        👤 Student: <b>{$studentName}</b>
        📘 Task: <b>{$taskTitle}</b>

        You can review and evaluate it in your dashboard.

        <a href="{$url}">View Submission</a>
        TEXT;
    }
}
