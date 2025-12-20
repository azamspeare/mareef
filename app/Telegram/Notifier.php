<?php

declare(strict_types=1);

namespace App\Telegram;

use App\Contracts\Abstracts\Telegram\TelegramMessage;
use Illuminate\Support\Facades\Log;
use SergiX44\Nutgram\Nutgram;
use SergiX44\Nutgram\Telegram\Exceptions\TelegramException;

final readonly class Notifier
{
    public function __construct(
        protected Nutgram $bot
    ) {
    }

    public function send(int $chatId, TelegramMessage $notification): bool
    {
        try {
            $this->bot->sendMessage(
                text: $notification->toText(),
                chat_id: $chatId,
                parse_mode: $notification->parseMode(),
                disable_web_page_preview: $notification->disablePreview(),
            );

            return true;
        } catch (TelegramException $exception) {
            Log::warning('Failed to send Telegram notification', [
                'chat_id' => $chatId,
                'error' => $exception->getMessage(),
            ]);

            return false;
        }
    }
}
