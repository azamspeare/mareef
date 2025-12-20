<?php

namespace App\Contracts\Interfaces\Helpers;

interface Normalizable
{
    public static function normalize(string $value): string;
}
