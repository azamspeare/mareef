<?php

declare(strict_types=1);

namespace App\Contracts\Interfaces;

use Illuminate\Http\Request;

/**
 * Interface for filter objects that can be created from HTTP requests.
 * Implements the Factory Method pattern for creating filter instances.
 */
interface Filterable
{
    /**
     * Create a filter instance from an HTTP request.
     *
     * @param Request $request The HTTP request containing filter parameters
     * @param int $teacher_id The teacher ID to filter by
     * @return self A new filter instance
     */
    public static function fromRequest(Request $request, int $teacher_id): self;
}
