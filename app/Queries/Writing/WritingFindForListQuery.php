<?php

declare(strict_types=1);

namespace App\Queries\Writing;

use App\Contracts\Abstracts\Filter\AbstractFilter;
use App\Contracts\Abstracts\Query\AbstractFilterQueryable;
use App\Contracts\Enums\ModelStatusEnum;
use App\Contracts\Interfaces\Query\FilterQueryable;
use App\Models\Writing\Writing;
use Illuminate\Pagination\LengthAwarePaginator;

final class WritingFindForListQuery extends AbstractFilterQueryable implements FilterQueryable
{
    public function query(AbstractFilter $filter): LengthAwarePaginator
    {
        $query = Writing::query();

        // Apply trashed filter
        match ($filter->trashed) {
            ModelStatusEnum::ALL => $query->withTrashed(),
            ModelStatusEnum::ARCHIVED => $query->onlyTrashed(),
            ModelStatusEnum::ACTIVE => null, // Default: only active records
        };

        return $query->where('teacher_id', '=', $filter->teacherId)
            ->when($filter->search, function ($query, $search) {
                return $query->whereAny(['title', 'slug'], 'like', "%{$search}%");
            })
            ->withCount('submissions')
            ->orderBy($filter->sortBy, $filter->sortDirection)
            ->paginate($filter->perPage);
    }
}
