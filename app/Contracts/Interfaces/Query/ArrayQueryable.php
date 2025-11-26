<?php

declare(strict_types=1);

namespace App\Contracts\Interfaces\Query;

/**
 * Interface for query classes that accept an array of arguments.
 * Provides flexibility for queries that don't require a specific filter object.
 */
interface ArrayQueryable
{
    /**
     * Execute a query with the provided array of arguments.
     *
     * @param array<string, mixed> $arguments Query arguments as key-value pairs
     * @return mixed Query results in any format
     */
    public function query(array $arguments = []): mixed;
}
