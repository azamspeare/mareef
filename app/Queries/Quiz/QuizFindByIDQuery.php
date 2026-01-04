<?php

declare(strict_types=1);

namespace App\Queries\Quiz;

use App\Contracts\Abstracts\Query\AbstractArrayQueryable;
use App\Contracts\Interfaces\Query\ArrayQueryable;
use App\Models\Quiz\Quiz;

final class QuizFindByIDQuery extends AbstractArrayQueryable implements ArrayQueryable
{
    public function query(array $arguments = []): ?Quiz
    {
        $id = $arguments['id'] ?? null;
        $teacher_id = $arguments['teacher_id'] ?? null;

        if (blank($id) || blank($teacher_id)) {
            abort(404);
        }

        $query = Quiz::query();

        if ($this->withTrashed) {
            $query->withTrashed();
        }

        return $query
            ->when(! empty($this->select), function ($query) {
                return $query->select($this->select);
            })
            ->where('teacher_id', '=', $teacher_id)
            ->where('id', '=', $id)
            ->with([
                'questions' => fn ($q) => $q->orderBy('order'),
                'questions.options' => fn ($q) => $q->orderBy('order'),
                'submissions' => fn ($q) => $q->select([
                    'id',
                    'quiz_id',
                    'student_id',
                    'score',
                    'spent_time',
                    'submitted_at',
                    'status',
                ]),
                'submissions.student:id,name,email,username',
            ])
            ->first();
    }
}
