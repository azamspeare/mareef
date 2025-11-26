<?php

declare(strict_types=1);

namespace App\Contracts\Interfaces\Query;

use App\Contracts\Abstracts\Filter\AbstractFilter;
use Illuminate\Pagination\LengthAwarePaginator;

/**
 * Interface for query classes that accept a filter object.
 * Implements the Strategy pattern where different filters can be applied to queries.
 */
interface FilterQueryable
{
    /**
     * Execute a query with the provided filter and return paginated results.
     *
     * @param AbstractFilter $filter The filter object containing query parameters
     * @return LengthAwarePaginator Paginated query results
     */
    public function query(AbstractFilter $filter): LengthAwarePaginator;
}
