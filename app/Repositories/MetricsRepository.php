<?php

declare(strict_types=1);

namespace App\Repositories;

use Illuminate\Support\Facades\DB;

final class MetricsRepository
{
    public function calculateSubmissionsMetrics(int $teacher_id): array
    {
        $now = now();
        $thisWeekStart = $now->copy()->subDays(7)->startOfDay();
        $lastWeekStart = $now->copy()->subDays(14)->startOfDay();

        // Single optimized query to get both this week and last week counts
        $result = DB::table('writing_submissions as ws')
            ->join('writings as w', 'ws.writing_id', '=', 'w.id')
            ->where('w.teacher_id', $teacher_id)
            ->whereNull('w.deleted_at')
            ->where('ws.submitted_at', '>=', $lastWeekStart)
            ->selectRaw('
                COUNT(CASE WHEN ws.submitted_at >= ? THEN 1 END) as this_week_submissions,
                COUNT(CASE WHEN ws.submitted_at >= ? AND ws.submitted_at < ? THEN 1 END) as last_week_submissions
            ', [$thisWeekStart, $lastWeekStart, $thisWeekStart])
            ->first();

        $thisWeek = (int) $result->this_week_submissions;
        $lastWeek = (int) $result->last_week_submissions;

        // Calculate CTR (Change Rate): ((this_week - last_week) / last_week) * 100
        // CTR is 0 if last_week is 0 or if the result is negative
        $ctr = $lastWeek > 0 ? (($thisWeek - $lastWeek) / $lastWeek) * 100 : 0;
        $ctr = max(0, $ctr); // Ensure CTR is never negative

        return [
            'last_week_submissions' => $lastWeek,
            'this_week_submissions' => $thisWeek,
            'ctr' => round($ctr, 2),
        ];
    }

    public function calculateStudentsMetrics(int $teacher_id): array
    {
        $now = now();
        $lastWeekStart = $now->copy()->subDays(7)->startOfDay();

        // Single optimized query to get total and new students
        $result = DB::table('writing_submissions as ws')
            ->join('writings as w', 'ws.writing_id', '=', 'w.id')
            ->join('users as s', 's.id', '=', 'ws.student_id')
            ->where('w.teacher_id', $teacher_id)
            ->whereNull('w.deleted_at')
            ->whereNull('s.deleted_at')
            ->selectRaw('
                COUNT(DISTINCT ws.student_id) as total_students,
                COUNT(DISTINCT CASE WHEN s.created_at >= ? THEN ws.student_id END) as new_students
            ', [$lastWeekStart])
            ->first();

        $total = (int) $result->total_students;
        $new = (int) $result->new_students;

        // Calculate CTR: (new / total) * 100
        // CTR is 0 if the total is 0
        $ctr = $total > 0 ? ($new / $total) * 100 : 0;

        return [
            'total_students' => $total,
            'new_students' => $new,
            'ctr' => round($ctr, 2),
        ];
    }

    public function calculateWritingMetrics(int $teacher_id): array
    {
        $now = now();
        $lastWeekStart = $now->copy()->subDays(7)->startOfDay();

        // Get total writings count
        $totalWritings = DB::table('writings')
            ->where('teacher_id', $teacher_id)
            ->whereNull('deleted_at')
            ->count();

        // Get writings that received submissions in the last 7 days
        $submittedWritings = DB::table('writings as w')
            ->join('writing_submissions as ws', 'w.id', '=', 'ws.writing_id')
            ->where('w.teacher_id', $teacher_id)
            ->where('ws.submitted_at', '>=', $lastWeekStart)
            ->whereNull('w.deleted_at')
            ->distinct()
            ->count('w.id');

        // Calculate CTR: (submitted / total) * 100
        // CTR is 0 if the total is 0
        $ctr = $totalWritings > 0 ? ($submittedWritings / $totalWritings) * 100 : 0;

        return [
            'total_writings' => $totalWritings,
            'submitted_writings' => $submittedWritings,
            'ctr' => round($ctr, 2),
        ];
    }
}
