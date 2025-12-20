<?php

namespace App\Actions\Telegram;

use App\DTOs\User\TelegramDTO;
use App\Models\Telegram\TelegramUser;

final class UpdateTelegramUserAction
{
    public function run(TelegramUser $user, TelegramDTO $dto): bool
    {
        return $user->update($dto->toArray());
    }
}
