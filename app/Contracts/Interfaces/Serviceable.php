<?php

declare(strict_types=1);

namespace App\Contracts\Interfaces;

interface Serviceable
{
    public function handle(): void;
}
