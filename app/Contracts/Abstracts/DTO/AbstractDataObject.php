<?php

declare(strict_types=1);

namespace App\Contracts\Abstracts\DTO;

use App\Contracts\Interfaces\DataObjectable;

abstract readonly class AbstractDataObject implements DataObjectable
{
    public function toNonNullArray(): array
    {
        return array_filter($this->toArray(), fn ($value) => ! blank($value));
    }
}
