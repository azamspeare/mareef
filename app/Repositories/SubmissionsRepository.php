<?php

declare(strict_types=1);

namespace App\Repositories;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

final class SubmissionsRepository
{
    private const CACHE_TTL = 300; // 5 minutes cache

    /**
     * Get all submission counts in a single optimized query.
     * Returns: ['total' => int, 'not_reviewed' => int, 'evaluated' => int]
     */
    public function getAllCounts(int $teacher_id): array
    {
        return Cache::remember(
            "counts:submissions:{$teacher_id}",
            self::CACHE_TTL,
            function () use ($teacher_id) {
                $result = DB::table('writing_submissions as ws')
                    ->join('writings as w', 'ws.writing_id', '=', 'w.id')
                    ->where('w.teacher_id', $teacher_id)
                    ->whereNull('w.deleted_at')
                    ->selectRaw('
                        COUNT(*) as total,
                        COUNT(CASE WHEN ws.evaluated_at IS NULL THEN 1 END) as not_reviewed,
                        COUNT(CASE WHEN ws.evaluated_at IS NOT NULL THEN 1 END) as evaluated
                    ')
                    ->first();

                return [
                    'total' => (int) $result->total,
                    'not_reviewed' => (int) $result->not_reviewed,
                    'evaluated' => (int) $result->evaluated,
                ];
            }
        );
    }

    public function countTotalSubmissions(int $teacher_id): int
    {
        return DB::table('writing_submissions as ws')
            ->join('writings as w', 'ws.writing_id', '=', 'w.id')
            ->where('w.teacher_id', $teacher_id)
            ->whereNull('w.deleted_at')
            ->count();
    }

    public function countNotReviewedSubmissions(int $teacher_id): int
    {
        return DB::table('writing_submissions as ws')
            ->join('writings as w', 'ws.writing_id', '=', 'w.id')
            ->where('w.teacher_id', $teacher_id)
            ->whereNull('w.deleted_at')
            ->whereNull('ws.evaluated_at')
            ->count();
    }

    public function countEvaluatedSubmissions(int $teacher_id): int
    {
        return DB::table('writing_submissions as ws')
            ->join('writings as w', 'ws.writing_id', '=', 'w.id')
            ->where('w.teacher_id', $teacher_id)
            ->whereNull('w.deleted_at')
            ->whereNotNull('ws.evaluated_at')
            ->count();
    }
}
