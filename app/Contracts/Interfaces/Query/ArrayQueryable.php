<?php

declare(strict_types=1);

namespace App\Contracts\Interfaces\Query;

interface ArrayQueryable
{
    public function query(array $arguments = []): mixed;
}
