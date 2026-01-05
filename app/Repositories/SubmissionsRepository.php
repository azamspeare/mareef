<?php

declare(strict_types=1);

namespace App\Repositories;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

final class SubmissionsRepository
{
    private const CACHE_TTL = 300; // 5-minute cache

    /**
     * Get all submission counts combining writing and quiz submissions.
     * Returns: ['total' => int, 'not_reviewed' => int, 'evaluated' => int]
     */
    public function getAllCounts(int $teacher_id): array
    {
        return Cache::remember(
            "counts:submissions:{$teacher_id}",
            self::CACHE_TTL,
            function () use ($teacher_id) {
                // Writing submissions counts
                $writingCounts = DB::table('writing_submissions as ws')
                    ->join('writings as w', 'ws.writing_id', '=', 'w.id')
                    ->where('w.teacher_id', $teacher_id)
                    ->whereNull('w.deleted_at')
                    ->whereNotNull('ws.submitted_at')
                    ->selectRaw('
                        COUNT(*) as total,
                        COUNT(CASE WHEN ws.evaluated_at IS NULL THEN 1 END) as not_reviewed,
                        COUNT(CASE WHEN ws.evaluated_at IS NOT NULL THEN 1 END) as evaluated
                    ')
                    ->first();

                // Quiz submissions counts
                $quizCounts = DB::table('quiz_submissions as qs')
                    ->join('quizzes as q', 'qs.quiz_id', '=', 'q.id')
                    ->where('q.teacher_id', $teacher_id)
                    ->whereNull('q.deleted_at')
                    ->whereNotNull('qs.submitted_at')
                    ->selectRaw('
                        COUNT(*) as total,
                        COUNT(CASE WHEN qs.evaluated_at IS NULL THEN 1 END) as not_reviewed,
                        COUNT(CASE WHEN qs.evaluated_at IS NOT NULL THEN 1 END) as evaluated
                    ')
                    ->first();

                return [
                    'total' => (int) $writingCounts->total + (int) $quizCounts->total,
                    'not_reviewed' => (int) $writingCounts->not_reviewed + (int) $quizCounts->not_reviewed,
                    'evaluated' => (int) $writingCounts->evaluated + (int) $quizCounts->evaluated,
                ];
            }
        );
    }

    public function countTotalSubmissions(int $teacher_id): int
    {
        return $this->getAllCounts($teacher_id)['total'];
    }

    public function countNotReviewedSubmissions(int $teacher_id): int
    {
        return $this->getAllCounts($teacher_id)['not_reviewed'];
    }

    public function countEvaluatedSubmissions(int $teacher_id): int
    {
        return $this->getAllCounts($teacher_id)['evaluated'];
    }

    public function invalidateCache(int $teacher_id): void
    {
        Cache::forget("counts:submissions:{$teacher_id}");
    }
}
