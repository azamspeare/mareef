<?php

declare(strict_types=1);

namespace App\Queries\User;

use App\Contracts\Enums\RoleEnum;
use App\Models\User\User;

final class TeacherFindByEmailQuery
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
