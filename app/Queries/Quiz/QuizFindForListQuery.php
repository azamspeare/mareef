<?php

declare(strict_types=1);

namespace App\Queries\Quiz;

use App\Contracts\Abstracts\Filter\AbstractFilter;
use App\Contracts\Abstracts\Query\AbstractFilterQueryable;
use App\Contracts\Enums\ModelStatusEnum;
use App\Contracts\Interfaces\Query\FilterQueryable;
use App\Models\Quiz\Quiz;
use Illuminate\Pagination\LengthAwarePaginator;

final class QuizFindForListQuery extends AbstractFilterQueryable implements FilterQueryable
{
    public function query(AbstractFilter $filter): LengthAwarePaginator
    {
        $query = Quiz::query()
            ->select(['id', 'teacher_id', 'title', 'slug', 'allocated_time', 'created_at', 'deleted_at']);

        // Apply trashed filter
        match ($filter->trashed) {
            ModelStatusEnum::ALL => $query->withTrashed(),
            ModelStatusEnum::ARCHIVED => $query->onlyTrashed(),
            ModelStatusEnum::ACTIVE => null,
        };

        return $query->where('teacher_id', '=', $filter->teacherId)
            ->when($filter->search, function ($query, $search) {
                return $query->whereAny(['title', 'slug'], 'like', "%{$search}%");
            })
            ->withCount('submissions')
            ->withCount('questions')
            ->orderBy($filter->sortBy, $filter->sortDirection)
            ->paginate($filter->perPage);
    }
}
