<?php

declare(strict_types=1);

namespace App\Repositories;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

final class MetricsRepository
{
    private const CACHE_TTL = 300; // 5 minutes cache for metrics

    public function calculateSubmissionsMetrics(int $teacher_id): array
    {
        return Cache::remember(
            "metrics:submissions:{$teacher_id}",
            self::CACHE_TTL,
            function () use ($teacher_id) {
                $now = now();
                $thisWeekStart = $now->copy()->subDays(7)->startOfDay();
                $lastWeekStart = $now->copy()->subDays(14)->startOfDay();

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

                $ctr = $lastWeek > 0 ? (($thisWeek - $lastWeek) / $lastWeek) * 100 : 0;
                $ctr = max(0, $ctr);

                return [
                    'last_week_submissions' => $lastWeek,
                    'this_week_submissions' => $thisWeek,
                    'ctr' => round($ctr, 2),
                ];
            }
        );
    }

    public function calculateStudentsMetrics(int $teacher_id): array
    {
        return Cache::remember(
            "metrics:students:{$teacher_id}",
            self::CACHE_TTL,
            function () use ($teacher_id) {
                $now = now();
                $lastWeekStart = $now->copy()->subDays(7)->startOfDay();

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

                $ctr = $total > 0 ? ($new / $total) * 100 : 0;

                return [
                    'total_students' => $total,
                    'new_students' => $new,
                    'ctr' => round($ctr, 2),
                ];
            }
        );
    }

    public function calculateWritingMetrics(int $teacher_id): array
    {
        return Cache::remember(
            "metrics:writings:{$teacher_id}",
            self::CACHE_TTL,
            function () use ($teacher_id) {
                $now = now();
                $lastWeekStart = $now->copy()->subDays(7)->startOfDay();

                $totalWritings = DB::table('writings')
                    ->where('teacher_id', $teacher_id)
                    ->whereNull('deleted_at')
                    ->count();

                $submittedWritings = DB::table('writings as w')
                    ->join('writing_submissions as ws', 'w.id', '=', 'ws.writing_id')
                    ->where('w.teacher_id', $teacher_id)
                    ->where('ws.submitted_at', '>=', $lastWeekStart)
                    ->whereNull('w.deleted_at')
                    ->distinct()
                    ->count('w.id');

                $ctr = $totalWritings > 0 ? ($submittedWritings / $totalWritings) * 100 : 0;

                return [
                    'total_writings' => $totalWritings,
                    'submitted_writings' => $submittedWritings,
                    'ctr' => round($ctr, 2),
                ];
            }
        );
    }

    /**
     * Invalidate all metrics cache for a teacher.
     * Call this when submissions, students, or writings change.
     */
    public static function invalidateCache(int $teacher_id): void
    {
        Cache::forget("metrics:submissions:{$teacher_id}");
        Cache::forget("metrics:students:{$teacher_id}");
        Cache::forget("metrics:writings:{$teacher_id}");
        Cache::forget("counts:submissions:{$teacher_id}");
    }
}
