<?php

declare(strict_types=1);

namespace App\Contracts\Abstracts\Service;

use App\Contracts\Interfaces\Serviceable;

abstract class AbstractService implements Serviceable
{
    private mixed $result;

    public function setResult(mixed $result = null): void
    {
        $this->result = $result;
    }

    public function getResult(): mixed
    {
        return $this->result;
    }
}
