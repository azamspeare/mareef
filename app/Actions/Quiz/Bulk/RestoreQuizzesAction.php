<?php

declare(strict_types=1);

namespace App\Actions\Quiz\Bulk;

use App\Models\Quiz\Quiz;

final class RestoreQuizzesAction
{
    public function run(array $ids, int $teacher_id): bool
    {
        return (bool) Quiz::query()
            ->withTrashed()
            ->where('teacher_id', '=', $teacher_id)
            ->whereIn('id', $ids)
            ->restore();
    }
}
