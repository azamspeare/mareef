<?php

namespace App\Contracts\Enums;

use App\Contracts\Enums\Traits\HasDefaults;
use App\Contracts\Interfaces\Enumable;

enum TelegramBotEnum : string implements Enumable
{
    use HasDefaults;

    case MAREEF_BOT = 'mareef_bot';
}
