<?php

namespace App\Actions\Telegram;

use App\DTOs\User\TelegramDTO;
use App\Models\Telegram\TelegramUser;

final class SetupTelegramUserAction
{
    public function run(TelegramDTO $dto): TelegramUser
    {
        return TelegramUser::query()->updateOrCreate(['chat_id' => $dto->chatId], $dto->toArray());
    }
}
