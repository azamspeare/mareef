<?php

namespace App\Contracts\Abstracts\Query;

use App\Contracts\Interfaces\Queryable;

abstract class AbstractQueryable implements Queryable
{
    protected array $select = [];

    public function select(array $select = []): static
    {
        $this->select = $select;

        return $this;
    }
}
