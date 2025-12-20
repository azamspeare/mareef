<?php

declare(strict_types=1);

namespace App\Contracts\Abstracts\Telegram;

abstract class TelegramMessage
{
    abstract public function toText(): string;

    public function parseMode(): string
    {
        return 'HTML';
    }

    public function disablePreview(): bool
    {
        return true;
    }
}
