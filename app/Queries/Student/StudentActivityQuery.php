<?php

declare(strict_types=1);

namespace App\Queries\Student;

use App\Models\Submission\WritingSubmission;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

final class StudentActivityQuery
{
    /**
     * Get daily submission counts for a student over the past year.
     * Only counts submissions to the specified teacher's writings.
     *
     * @return array<string, int> Date (Y-m-d) => submission count
     */
    public function query(int $studentId, int $teacherId, int $days = 365): array
    {
        $startDate = Carbon::now()->subDays($days)->startOfDay();

        $submissions = WritingSubmission::query()
            ->select(DB::raw('DATE(submitted_at) as date'), DB::raw('COUNT(*) as count'))
            ->join('writings', 'writing_submissions.writing_id', '=', 'writings.id')
            ->where('writing_submissions.student_id', $studentId)
            ->where('writings.teacher_id', $teacherId)
            ->whereNull('writings.deleted_at')
            ->where('writing_submissions.submitted_at', '>=', $startDate)
            ->groupBy('date')
            ->pluck('count', 'date')
            ->toArray();

        return $submissions;
    }
}
