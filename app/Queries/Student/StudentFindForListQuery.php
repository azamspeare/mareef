<?php

declare(strict_types=1);

namespace App\Queries\Student;

use App\Contracts\Abstracts\Filter\AbstractFilter;
use App\Contracts\Enums\RoleEnum;
use App\Contracts\Interfaces\Query\FilterQueryable;
use App\Contracts\Interfaces\Queryable;
use App\Filters\Students\StudentFilter;
use App\Models\User\User;
use Illuminate\Pagination\LengthAwarePaginator;

final class StudentFindForListQuery implements FilterQueryable, Queryable
{
    /**
     * Returns a paginated list of students for the given teacher.
     *
     * @param StudentFilter $filter
     *
     * @return LengthAwarePaginator
     */
    public function query(AbstractFilter $filter): LengthAwarePaginator
    {
        $query = User::query()
            ->select('users.*')
            ->where('users.role', '=', RoleEnum::STUDENT->value)
            ->whereHas('submissions', function ($q) use ($filter) {
                $q->whereHas('writing', function ($q) use ($filter) {
                    $q->where('teacher_id', $filter->teacherId)
                      ->whereNull('deleted_at');
                });
            })
            ->withCount([
                'submissions' => function ($q) use ($filter) {
                    $q->whereHas('writing', function ($q) use ($filter) {
                        $q->where('teacher_id', $filter->teacherId)
                          ->whereNull('deleted_at');
                    });
                }
            ]);

        // Search filter: search in student name
        if ($filter->search) {
            $search = '%' . $filter->search . '%';
            $query->whereAny(['users.name', 'users.email'], 'like', $search);
        }

        // Sorting
        $sortColumn = match ($filter->sortBy) {
            'id' => 'users.id',
            'submission_count' => 'submissions_count',
            'created_at' => 'users.created_at',
            default => 'users.created_at',
        };

        return $query
            ->orderBy($sortColumn, $filter->sortDirection)
            ->paginate($filter->perPage);
    }
}
