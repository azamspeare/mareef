<?php

declare(strict_types=1);

namespace App\Contracts\Interfaces;

interface Enumable
{
     public static function toArray(): array;
     public static function toFlip(): array;
}
