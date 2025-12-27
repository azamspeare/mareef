<?php

declare(strict_types=1);

namespace App\Helpers\Generator;

final class CodeGenerator
{
    /**
     * Generate a random numeric OTP code.
     */
    public static function otp(int $length = 6): string
    {
        $min = (int) str_pad('1', $length, '0');
        $max = (int) str_pad('', $length, '9');

        return (string) random_int($min, $max);
    }
}
