<?php

declare(strict_types=1);

namespace App\Contracts\Abstracts\Filter;

use App\Contracts\Interfaces\Filterable;
use Illuminate\Http\Request;

/**
 * Abstract base class for filter objects.
 *
 * Implements the Template Method pattern by providing common filtering functionality
 * while allowing child classes to define specific sortable fields and validation logic.
 *
 * Design principles applied:
 * - Single Responsibility: Handles only filter parameter management and validation
 * - Open/Closed: Open for extension (via inheritance), closed for modification
 * - Liskov Substitution: All filters can be used interchangeably via this base type
 * - Dependency Inversion: Depends on Filterable abstraction, not concrete implementations
 */
abstract readonly class AbstractFilter implements Filterable
{
    /**
     * Create a new filter instance.
     *
     * @param int $teacherId The teacher ID to filter by
     * @param string|null $search Optional search term
     * @param string $sortBy Column to sort by
     * @param string $sortDirection Sort direction (asc|desc)
     * @param int $perPage Number of items per page
     */
    public function __construct(
        public int $teacherId,
        public ?string $search,
        public string $sortBy,
        public string $sortDirection,
        public int $perPage,
    ) {
    }

    /**
     * Get the list of sortable fields for this filter.
     * Child classes must implement this to define which fields can be sorted.
     *
     * @return array<string> List of sortable field names
     */
    abstract public static function sortables(): array;

    /**
     * Create a filter instance from an HTTP request.
     * Child classes must implement this to handle their specific parameters.
     *
     * @param Request $request The HTTP request
     * @param int $teacher_id The teacher ID
     * @return static A new filter instance
     */
    abstract public static function fromRequest(Request $request, int $teacher_id): self;

    /**
     * Validate and sanitize the sort field.
     * Returns the input if it's in the sortables list, otherwise defaults to 'created_at'.
     *
     * @param mixed $input The sort field from request
     * @return string Validated sort field
     */
    protected static function validateSortBy(mixed $input): string
    {
        $input = strtolower((string) $input);

        if (in_array($input, static::sortables(), true)) {
            return $input;
        }

        return 'created_at';
    }

    /**
     * Validate and sanitize the sort direction.
     * Only allows 'asc' or 'desc', defaults to 'desc' for invalid input.
     *
     * @param mixed $input The sort direction from request
     * @return string Validated sort direction ('asc' or 'desc')
     */
    protected static function validateSortDirection(mixed $input): string
    {
        return match (strtolower((string) $input)) {
            'asc', 'desc' => strtolower((string) $input),
            default => 'desc',
        };
    }
}
