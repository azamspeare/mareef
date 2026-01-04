<?php

declare(strict_types=1);

namespace App\Filters\Quiz;

use App\Contracts\Abstracts\Filter\AbstractFilter;
use Illuminate\Http\Request;

final readonly class QuizFilter extends AbstractFilter
{
    public static function sortables(): array
    {
        return ['id', 'submission_count', 'allocated_time', 'created_at'];
    }

    public static function fromRequest(Request $request, int $teacher_id): self
    {
        [$search, $sortBy, $sortDirection, $perPage, $trashed] = self::resolveDefaultValues($request);

        return new self(
            teacherId: $teacher_id,
            search: $search,
            sortBy: $sortBy,
            sortDirection: $sortDirection,
            perPage: $perPage,
            trashed: $trashed
        );
    }
}
