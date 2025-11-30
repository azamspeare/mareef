<?php

declare(strict_types=1);

namespace App\Queries\Writing;

use App\Contracts\Abstracts\Query\AbstractArrayQueryable;
use App\Contracts\Interfaces\Query\ArrayQueryable;
use App\Models\Writing\Writing;

final class WritingFindByIDQuery extends AbstractArrayQueryable implements ArrayQueryable
{
    public function query(array $arguments = []): ?Writing
    {
        $id = $arguments['id'] ?? null;
        $teacher_id = $arguments['teacher_id'] ?? null;

        if (blank($id) || blank($teacher_id)) {
            abort(404);
        }

        $query = Writing::query();

        if ($this->withTrashed) {
            $query->onlyTrashed();
        }

        return $query
            ->when(! empty($this->select), function ($query) {
                return $query->select($this->select);
            })
            ->where('teacher_id', '=', $teacher_id)
            ->where('id', '=', $id)
            ->with('submissions')
            ->first();
    }
}
