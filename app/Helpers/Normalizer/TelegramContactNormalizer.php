<?php

declare(strict_types=1);

namespace App\Helpers\Normalizer;

use App\Contracts\Interfaces\Helpers\Normalizable;

final class TelegramContactNormalizer implements Normalizable
{
    public static function normalize(string $value): string
    {
        $cleaned = preg_replace('/[^0-9]/', '', $value);

        if (str_starts_with($cleaned, '998') && strlen($cleaned) === 12) {
            return '+' . $cleaned;
        }

        if (strlen($cleaned) === 9) {
            return '+998' . $cleaned;
        }

        return '+' . $cleaned;
    }
}
