<?php

declare(strict_types=1);

namespace App\Queries\Submission;

use App\Contracts\Abstracts\Query\AbstractArrayQueryable;
use App\Contracts\Interfaces\Query\ArrayQueryable;
use App\Models\Submission\Writing\WritingSubmission;

final class SubmissionFindByWritingAndStudentIDQuery extends AbstractArrayQueryable implements ArrayQueryable
{
    public function query(array $arguments = []): ?WritingSubmission
    {
        $writing_id = $arguments['writing_id'] ?? null;
        $student_id = $arguments['student_id'] ?? null;

        if (blank($writing_id) || blank($student_id)) {
            abort(404);
        }

        return WritingSubmission::query()
            ->where('writing_id', '=', $writing_id)
            ->where('student_id', '=', $student_id)
            ->with(['writing', 'student', 'feedback'])
            ->first();
    }
}
