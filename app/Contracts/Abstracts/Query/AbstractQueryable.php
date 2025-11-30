<?php

namespace App\Contracts\Abstracts\Query;

use App\Contracts\Interfaces\Queryable;

abstract class AbstractQueryable implements Queryable
{
    protected array $select = [];
    protected bool $withTrashed = false;

    public function select(array $select = []): static
    {
        $this->select = $select;

        return $this;
    }

    public function withTrashed(): static
    {
        $this->withTrashed = true;

        return $this;
    }

    public function withoutTrashed(): static
    {
        $this->withTrashed = false;

        return $this;
    }
}
