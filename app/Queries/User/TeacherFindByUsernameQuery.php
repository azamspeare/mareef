<?php

declare(strict_types=1);

namespace App\Queries\User;

use App\Contracts\Abstracts\Query\AbstractArrayQueryable;
use App\Contracts\Enums\RoleEnum;
use App\Contracts\Interfaces\Query\ArrayQueryable;
use App\Models\User\User;

final class TeacherFindByUsernameQuery extends AbstractArrayQueryable implements ArrayQueryable
{
    public function query(array $arguments = []): ?User
    {
        $username = $arguments['username'] ?? null;
        if (blank($username)) {
            return null;
        }

        return User::query()
            ->where('username', '=', $username)
            ->where('role', '=', RoleEnum::TEACHER->value)
            ->first();
    }
}
