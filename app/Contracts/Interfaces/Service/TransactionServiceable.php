<?php

declare(strict_types=1);

namespace App\Contracts\Interfaces\Service;

interface TransactionServiceable
{
    public function transaction(): bool;
}
