<?php

declare(strict_types=1);

namespace App\Queries\Quiz;

use App\Contracts\Abstracts\Query\AbstractArrayQueryable;
use App\Contracts\Interfaces\Query\ArrayQueryable;
use App\Models\Submission\Quiz\QuizSubmission;

final class QuizSubmissionFindByIDQuery extends AbstractArrayQueryable implements ArrayQueryable
{
    public function query(array $arguments = []): ?QuizSubmission
    {
        $id = $arguments['id'] ?? null;
        $teacherId = $arguments['teacher_id'] ?? null;

        if (blank($id) || blank($teacherId)) {
            abort(404);
        }

        return QuizSubmission::query()
            ->whereHas('quiz', fn ($query) => $query->where('teacher_id', $teacherId))
            ->where('id', $id)
            ->with([
                'quiz:id,teacher_id,title,slug,allocated_time',
                'quiz.questions' => fn ($q) => $q->orderBy('order'),
                'quiz.questions.options' => fn ($q) => $q->orderBy('order'),
                'student:id,name,email,username,avatar',
                'answers',
            ])
            ->first();
    }
}
