<?php

declare(strict_types=1);

namespace App\Queries\Student;

use App\Contracts\Abstracts\Query\AbstractFilterQueryable;
use App\Contracts\Interfaces\Query\ArrayQueryable;
use App\Models\Submission\WritingSubmission;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

final class StudentActivityQuery extends AbstractFilterQueryable implements ArrayQueryable
{
    /**
     * Get daily submission counts for a student over the specified period.
     * Only counts submissions to the specified teacher's writings.
     *
     * @return array<string, int> Date (Y-m-d) => submission count
     */
    public function query(array $arguments = []): array
    {
        $student_id = $arguments['student_id'];
        $teacher_id = $arguments['teacher_id'];
        $days = $arguments['days'] ?? 90;

        $startDate = Carbon::now()->subDays($days)->startOfDay();

        return WritingSubmission::query()
            ->select(DB::raw('DATE(submitted_at) as date'), DB::raw('COUNT(*) as count'))
            ->join('writings', 'writing_submissions.writing_id', '=', 'writings.id')
            ->where('writing_submissions.student_id', '=', $student_id)
            ->where('writings.teacher_id', '=', $teacher_id)
            ->whereNull('writings.deleted_at')
            ->where('writing_submissions.submitted_at', '>=', $startDate)
            ->groupBy('date')
            ->pluck('count', 'date')
            ->toArray();
    }
}
