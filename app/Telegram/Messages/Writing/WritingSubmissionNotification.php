<?php

declare(strict_types=1);

namespace App\Telegram\Messages\Writing;

use App\Contracts\Abstracts\Telegram\TelegramMessage;
use App\Models\Submission\Writing\WritingSubmission;

final class WritingSubmissionNotification extends TelegramMessage
{
    public function __construct(
        protected readonly WritingSubmission $submission
    ) {
    }

    public function toText(): string
    {
        $studentName = $this->submission->student->name;
        $taskTitle = $this->submission->writing->title;
        $url = route('writings.submissions.show', ['id' => $this->submission->id]);

        return <<<TEXT
        📩 New submission received.

        👤 Student: <b>{$studentName}</b>
        📘 Writing Task: <b>{$taskTitle}</b>

        You can review and evaluate it in your dashboard.

        <a href="{$url}">View Writing Submission</a>
        TEXT;
    }
}
