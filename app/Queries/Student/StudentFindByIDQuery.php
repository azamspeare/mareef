<?php

declare(strict_types=1);

namespace App\Queries\Student;

use App\Contracts\Abstracts\Query\AbstractArrayQueryable;
use App\Contracts\Enums\RoleEnum;
use App\Contracts\Interfaces\Query\ArrayQueryable;
use App\Models\User\User;

final class StudentFindByIDQuery extends AbstractArrayQueryable implements ArrayQueryable
{
    public function query(array $arguments = []): ?User
    {
        $id = $arguments['id'] ?? null;
        $teacher_id = $arguments['teacher_id'] ?? null;

        if (blank($id) || blank($teacher_id)) {
            abort(404);
        }

        // Teacher can only access students who have submitted to their writings
        $teacherWritingConstraint = function ($q) use ($teacher_id) {
            $q->where('teacher_id', $teacher_id)
              ->whereNull('deleted_at');
        };

        $query = User::query()
            ->where('role', '=', RoleEnum::STUDENT->value)
            ->where('id', '=', $id)
            ->whereHas('submissions', function ($q) use ($teacherWritingConstraint) {
                $q->whereHas('writing', $teacherWritingConstraint);
            });

        if ($this->withTrashed) {
            $query->withTrashed();
        }

        $student = $query
            ->when(! empty($this->select), function ($query) {
                return $query->select($this->select);
            })
            ->first();

        if (! $student) {
            abort(404);
        }

        return $student;
    }
}
