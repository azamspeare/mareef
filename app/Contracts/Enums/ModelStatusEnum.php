<?php

namespace App\Contracts\Enums;

use App\Contracts\Enums\Traits\HasDefaults;
use App\Contracts\Interfaces\Enumable;

enum ModelStatusEnum : string implements Enumable
{
    use HasDefaults;

    case ALL = 'all';
    case ACTIVE = 'active';
    case ARCHIVED = 'archived';

    public static function isAll(string $status): bool
    {
        return mb_strtolower($status) === self::ALL->value;
    }

    public static function isActive(string $status): bool
    {
        return mb_strtolower($status) === self::ACTIVE->value;
    }

    public static function isArchived(string $status): bool
    {
        return mb_strtolower($status) === self::ARCHIVED->value;
    }
}
