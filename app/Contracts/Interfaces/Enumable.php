<?php

namespace App\Contracts\Interfaces;

interface Enumable
{
     public static function toArray(): array;
     public static function toFlip(): array;
}
