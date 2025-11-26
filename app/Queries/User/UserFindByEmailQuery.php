<?php

declare(strict_types=1);

namespace App\Queries\User;

use App\Contracts\Interfaces\Query\ArrayQueryable;
use App\Contracts\Interfaces\Queryable;
use App\Models\User\User;

final class UserFindByEmailQuery implements ArrayQueryable, Queryable
{
    public function query(array $arguments = []): ?User
    {
        $email = $arguments['email'] ?? null;
        if (blank($email)) {
            return null;
        }

        return User::query()
            ->where('email', '=', $email)
            ->first();
    }
}
