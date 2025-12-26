<?php

declare(strict_types=1);

namespace App\Queries\Telegram;

use App\Contracts\Abstracts\Query\AbstractArrayQueryable;
use App\Contracts\Interfaces\Query\ArrayQueryable;
use App\Models\Telegram\TelegramUser;

final class TelegramUserFindByChatIDQuery extends AbstractArrayQueryable implements ArrayQueryable
{
    public function query(array $arguments = []): ?TelegramUser
    {
        $chat_id = $arguments['chat_id'] ?? null;
        if (blank($chat_id)) {
            return null;
        }

        return TelegramUser::query()
            ->where('chat_id', '=', $chat_id)
            ->first();
    }
}
