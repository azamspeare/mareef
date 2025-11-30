<?php

declare(strict_types=1);

namespace App\Contracts\Interfaces;

interface Queryable
{
    public function select(array $select = []): static;
}
