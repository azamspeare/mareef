<?php

declare(strict_types=1);

namespace App\Queries\Student;

use App\Contracts\Abstracts\Filter\AbstractFilter;
use App\Contracts\Abstracts\Query\AbstractFilterQueryable;
use App\Contracts\Enums\SubmissionStatusEnum;
use App\Contracts\Interfaces\Query\FilterQueryable;
use App\Models\Submission\Writing\WritingSubmission;
use Illuminate\Pagination\LengthAwarePaginator;

final class StudentSubmissionFindForListQuery extends AbstractFilterQueryable implements FilterQueryable
{
    public function query(AbstractFilter $filter): LengthAwarePaginator
    {
        $query = WritingSubmission::query()
            ->select([
                'writing_submissions.id',
                'writing_submissions.writing_id',
                'writing_submissions.student_id',
                'writing_submissions.spent_time',
                'writing_submissions.submitted_at',
                'writing_submissions.evaluated_at',
                'writing_submissions.created_at',
            ])
            ->join('writings', 'writing_submissions.writing_id', '=', 'writings.id')
            ->where('writings.teacher_id', $filter->teacherId)
            ->where('writing_submissions.student_id', $filter->studentId)
            ->whereNull('writings.deleted_at')
            ->with([
                'writing:id,title,allocated_time',
                'feedback:id,submission_id,score',
            ]);

        // Status filter
        match ($filter->status) {
            SubmissionStatusEnum::NOT_REVIEWED => $query->whereNull('writing_submissions.evaluated_at'),
            SubmissionStatusEnum::EVALUATED => $query->whereNotNull('writing_submissions.evaluated_at'),
            SubmissionStatusEnum::ALL => null,
        };

        // Sorting
        $sortColumn = match ($filter->sortBy) {
            'id', 'spent_time', 'submitted_at', 'evaluated_at', 'created_at' => 'writing_submissions.' . $filter->sortBy,
            default => 'writing_submissions.submitted_at',
        };

        return $query
            ->orderBy($sortColumn, $filter->sortDirection)
            ->paginate($filter->perPage);
    }
}
