<?php

declare(strict_types=1);

namespace App\Contracts\Abstracts\Filter;

use App\Contracts\Enums\ModelStatusEnum;
use App\Contracts\Interfaces\Filterable;
use Illuminate\Http\Request;

abstract readonly class AbstractFilter implements Filterable
{
    public function __construct(
        public int     $teacherId,
        public ?string $search,
        public string  $sortBy,
        public string  $sortDirection,
        public int     $perPage,
        public ModelStatusEnum $trashed
    ) {
    }


    abstract public static function sortables(): array;

    abstract public static function fromRequest(Request $request, int $teacher_id): self;

    protected static function validateSortBy(mixed $input): string
    {
        $input = strtolower((string)$input);

        if (in_array($input, static::sortables(), true)) {
            return $input;
        }

        return 'created_at';
    }

    protected static function validateSortDirection(mixed $input): string
    {
        return match (strtolower((string)$input)) {
            'asc', 'desc' => strtolower((string)$input),
            default => 'desc',
        };
    }

    protected static function validateTrashed(mixed $input): ModelStatusEnum
    {
        $input = strtolower((string)$input);

        $enum = ModelStatusEnum::tryFrom($input);

        return $enum ?? ModelStatusEnum::ACTIVE;
    }

    protected static function resolveDefaultValues(Request $request): array
    {
        $search = $request->filled('search') ? $request->string('search')->trim()->value() : null;
        $sortBy = self::validateSortBy($request->input('sort_by'));
        $sortDirection = self::validateSortDirection($request->input('sort_direction', 'desc'));
        $perPage = $request->input('per_page', 10);
        $trashed = self::validateTrashed($request->input('trashed'));

        return [$search, $sortBy, $sortDirection, $perPage, $trashed];
    }
}
