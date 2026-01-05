<?php

declare(strict_types=1);

namespace App\Queries\Submission;

use App\Contracts\Abstracts\Filter\AbstractFilter;
use App\Contracts\Abstracts\Query\AbstractFilterQueryable;
use App\Contracts\Enums\SubmissionStatusEnum;
use App\Contracts\Enums\SubmissionTaskTypeEnum;
use App\Contracts\Interfaces\Query\FilterQueryable;
use App\Filters\Submission\SubmissionFilter;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

final class SubmissionFindForListQuery extends AbstractFilterQueryable implements FilterQueryable
{
    /**
     * @param SubmissionFilter $filter
     */
    public function query(AbstractFilter $filter): LengthAwarePaginator
    {
        $teacherId = $filter->teacherId;
        $search = $filter->search ? '%' . $filter->search . '%' : null;

        // Build writing submissions query
        $writingQuery = DB::table('writing_submissions as ws')
            ->join('writings as w', 'ws.writing_id', '=', 'w.id')
            ->join('users as s', 'ws.student_id', '=', 's.id')
            ->leftJoin('writing_feedbacks as wf', 'ws.id', '=', 'wf.submission_id')
            ->where('w.teacher_id', $teacherId)
            ->whereNull('w.deleted_at')
            ->whereNotNull('ws.submitted_at')
            ->select([
                'ws.id',
                DB::raw("'writing' as type"),
                'ws.writing_id as task_id',
                'w.title as task_title',
                'ws.student_id',
                's.name as student_name',
                'ws.spent_time',
                'ws.submitted_at',
                'ws.evaluated_at',
                'ws.created_at',
                'wf.score',
            ]);

        // Build quiz submissions query
        $quizQuery = DB::table('quiz_submissions as qs')
            ->join('quizzes as q', 'qs.quiz_id', '=', 'q.id')
            ->join('users as s', 'qs.student_id', '=', 's.id')
            ->where('q.teacher_id', $teacherId)
            ->whereNull('q.deleted_at')
            ->whereNotNull('qs.submitted_at')
            ->select([
                'qs.id',
                DB::raw("'quiz' as type"),
                'qs.quiz_id as task_id',
                'q.title as task_title',
                'qs.student_id',
                's.name as student_name',
                'qs.spent_time',
                'qs.submitted_at',
                'qs.evaluated_at',
                'qs.created_at',
                'qs.score',
            ]);

        // Apply search filter to both queries
        if ($search) {
            $writingQuery->where(function ($q) use ($search) {
                $q->where('s.name', 'like', $search)
                    ->orWhere('s.username', 'like', $search)
                    ->orWhere('w.title', 'like', $search)
                    ->orWhere('w.slug', 'like', $search);
            });

            $quizQuery->where(function ($q) use ($search) {
                $q->where('s.name', 'like', $search)
                    ->orWhere('s.username', 'like', $search)
                    ->orWhere('q.title', 'like', $search)
                    ->orWhere('q.slug', 'like', $search);
            });
        }

        // Apply status filter to both queries
        match ($filter->status) {
            SubmissionStatusEnum::NOT_REVIEWED => (function () use ($writingQuery, $quizQuery) {
                $writingQuery->whereNull('ws.evaluated_at');
                $quizQuery->whereNull('qs.evaluated_at');
            })(),
            SubmissionStatusEnum::EVALUATED => (function () use ($writingQuery, $quizQuery) {
                $writingQuery->whereNotNull('ws.evaluated_at');
                $quizQuery->whereNotNull('qs.evaluated_at');
            })(),
            SubmissionStatusEnum::ALL => null,
        };

        // Build final query based on task type filter
        $finalQuery = match ($filter->taskType) {
            SubmissionTaskTypeEnum::WRITING => $writingQuery,
            SubmissionTaskTypeEnum::QUIZ => $quizQuery,
            SubmissionTaskTypeEnum::ALL => $writingQuery->union($quizQuery),
        };

        // Wrap in subquery for sorting and pagination
        $query = DB::table(DB::raw("({$finalQuery->toSql()}) as submissions"))
            ->mergeBindings($finalQuery);

        // Sorting
        $sortColumn = match ($filter->sortBy) {
            'id', 'spent_time', 'submitted_at', 'evaluated_at', 'created_at' => $filter->sortBy,
            default => 'submitted_at',
        };

        $query->orderBy($sortColumn, $filter->sortDirection);

        // Paginate
        $paginated = $query->paginate($filter->perPage);

        // Transform results to include nested task object for frontend compatibility
        $paginated->through(function ($item) {
            return [
                'id' => $item->id,
                'type' => $item->type,
                'task_id' => $item->task_id,
                'task_title' => $item->task_title,
                'student_id' => $item->student_id,
                'student_name' => $item->student_name,
                'spent_time' => $item->spent_time,
                'submitted_at' => $item->submitted_at,
                'evaluated_at' => $item->evaluated_at,
                'created_at' => $item->created_at,
                'score' => $item->score,
            ];
        });

        return $paginated;
    }
}
