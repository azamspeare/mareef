<?php

namespace App\Contracts\Enums\Traits;

trait HasDefaults
{
    public static function toArray(): array
    {
        return array_column(self::cases(), 'value');
    }

    public static function toFlip(): array
    {
        return array_flip(self::toArray());
    }
}
