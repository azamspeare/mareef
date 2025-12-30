<?php

declare(strict_types=1);

namespace App\Queries\Submission;

use App\Contracts\Abstracts\Query\AbstractArrayQueryable;
use App\Contracts\Interfaces\Query\ArrayQueryable;
use App\Models\Submission\Writing\WritingSubmission;

final class SubmissionFindByIDQuery extends AbstractArrayQueryable implements ArrayQueryable
{
    public function query(array $arguments = []): ?WritingSubmission
    {
        $id = $arguments['id'] ?? null;
        $teacher_id = $arguments['teacher_id'] ?? null;

        if (blank($id) || blank($teacher_id)) {
            abort(404);
        }

        return WritingSubmission::query()
            ->whereHas('writing', function ($query) use ($teacher_id) {
                return $query->where('teacher_id', '=', $teacher_id);
            })
            ->where('id', '=', $id)
            ->with([
                'writing:id,teacher_id,title,slug,content,allocated_time',
                'student:id,name,email,username',
                'feedback',
            ])
            ->first();
    }
}
