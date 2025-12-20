<?php

namespace App\Actions\Telegram;

use App\DTOs\User\TelegramDTO;
use App\Models\Telegram\TelegramUser;

final class CreateTelegramUserAction
{
    public function run(TelegramDTO $dto): TelegramUser
    {
        return TelegramUser::query()->create($dto->toNonNullArray());
    }
}
