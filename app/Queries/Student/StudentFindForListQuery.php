<?php

declare(strict_types=1);

namespace App\Queries\Student;

use App\Contracts\Abstracts\Filter\AbstractFilter;
use App\Contracts\Abstracts\Query\AbstractFilterQueryable;
use App\Contracts\Enums\RoleEnum;
use App\Contracts\Interfaces\Query\FilterQueryable;
use App\Filters\Student\StudentFilter;
use App\Models\User\User;
use Illuminate\Pagination\LengthAwarePaginator;

final class StudentFindForListQuery extends AbstractFilterQueryable implements FilterQueryable
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
        // Define the teacher ownership constraint once
        $teacherWritingConstraint = function ($q) use ($filter) {
            $q->where('teacher_id', $filter->teacherId)
              ->whereNull('deleted_at');
        };

        $query = User::query()
            ->select('users.*')
            ->where('users.role', '=', RoleEnum::STUDENT->value)
            ->whereHas('submissions', function ($q) use ($teacherWritingConstraint) {
                $q->whereHas('writing', $teacherWritingConstraint);
            })
            ->withCount([
                'submissions' => function ($q) use ($teacherWritingConstraint) {
                    $q->whereHas('writing', $teacherWritingConstraint);
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
