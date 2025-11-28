<?php

declare(strict_types=1);

namespace App\Queries\User;

use App\Contracts\Abstracts\Query\AbstractArrayQueryable;
use App\Contracts\Enums\RoleEnum;
use App\Contracts\Interfaces\Query\ArrayQueryable;
use App\Models\User\User;

final class TeacherFindByEmailQuery extends AbstractArrayQueryable implements ArrayQueryable
{
    public function query(array $arguments = []): ?User
    {
        $email = $arguments['email'] ?? null;
        if (blank($email)) {
            return null;
        }

        return User::query()
            ->where('email', '=', $email)
            ->where('role', '=', RoleEnum::TEACHER->value)
            ->first();
    }
}
