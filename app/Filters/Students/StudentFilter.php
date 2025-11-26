<?php

declare(strict_types=1);

namespace App\Filters\Students;

use App\Contracts\Abstracts\Filter\AbstractFilter;
use Illuminate\Http\Request;

final readonly class StudentFilter extends AbstractFilter
{
    public static function sortables(): array
    {
        return ['id', 'submission_count', 'created_at'];
    }

    public static function fromRequest(Request $request, int $teacher_id): self
    {
        $search = $request->filled('search') ? $request->string('search')->trim()->value() : null;
        $sortBy = self::validateSortBy($request->input('sort_by', 'id'));
        $sortDirection = self::validateSortDirection($request->input('sort_direction', 'desc'));
        $perPage = $request->input('per_page', 10);

        return new self(
            teacherId: $teacher_id,
            search: $search,
            sortBy: $sortBy,
            sortDirection: $sortDirection,
            perPage: $perPage,
        );
    }
}
