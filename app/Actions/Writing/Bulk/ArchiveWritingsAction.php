<?php

declare(strict_types=1);

namespace App\Actions\Writing\Bulk;

use App\Models\Writing\Writing;

final class ArchiveWritingsAction
{
    public function run(array $ids, int $teacher_id): bool
    {
        return Writing::query()
            ->where('teacher_id', '=', $teacher_id)
            ->whereIn('id', $ids)
            ->delete();
    }
}
