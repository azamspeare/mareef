<?php

declare(strict_types=1);

namespace App\Contracts\Interfaces\Query;

use App\Contracts\Abstracts\Filter\AbstractFilter;
use Illuminate\Pagination\LengthAwarePaginator;

interface FilterQueryable
{
    public function query(AbstractFilter $filter): LengthAwarePaginator;
}
