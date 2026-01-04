<?php

declare(strict_types=1);

namespace App\Queries\Quiz;

use App\Contracts\Abstracts\Query\AbstractArrayQueryable;
use App\Contracts\Interfaces\Query\ArrayQueryable;
use App\Models\Quiz\Quiz;

final class QuizFindBySlugQuery extends AbstractArrayQueryable implements ArrayQueryable
{
    public function query(array $arguments = []): ?Quiz
    {
        $slug = $arguments['slug'] ?? null;
        $teacher_id = $arguments['teacher_id'] ?? null;

        if (blank($slug) || blank($teacher_id)) {
            abort(404);
        }

        $query = Quiz::query();

        if ($this->withTrashed) {
            $query->onlyTrashed();
        }

        return $query
            ->when(! empty($this->select), function ($query) {
                return $query->select($this->select);
            })
            ->where('teacher_id', '=', $teacher_id)
            ->where('slug', '=', $slug)
            ->with('submissions')
            ->first();
    }
}
