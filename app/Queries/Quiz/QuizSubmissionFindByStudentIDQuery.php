<?php

declare(strict_types=1);

namespace App\Queries\Quiz;

use App\Contracts\Abstracts\Query\AbstractArrayQueryable;
use App\Contracts\Interfaces\Query\ArrayQueryable;
use App\Models\Submission\Quiz\QuizSubmission;

final class QuizSubmissionFindByStudentIDQuery extends AbstractArrayQueryable implements ArrayQueryable
{
    public function query(array $arguments = []): ?QuizSubmission
    {
        $quiz_id = $arguments['quiz_id'] ?? null;
        $student_id = $arguments['student_id'] ?? null;

        if (blank($quiz_id) || blank($student_id)) {
            abort(404);
        }

        return QuizSubmission::query()
            ->where('quiz_id', '=', $quiz_id)
            ->where('student_id', '=', $student_id)
            ->with(['quiz', 'student'])
            ->first();
    }
}
