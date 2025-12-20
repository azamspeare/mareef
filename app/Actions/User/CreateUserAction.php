<?php

declare(strict_types=1);

namespace App\Actions\User;

use App\DTOs\User\LoginDTO;
use App\Models\User\User;

final class CreateUserAction
{
    public function run(LoginDTO $dto): User
    {
        $data = $dto->toArray();

        $username = $data['username'];
        $counter = 1;

        while (User::query()->where('username', $username)->exists()) {
            $username = $data['username'] . $counter;
            $counter++;
        }

        $data['username'] = $username;

        return User::query()->create($data);
    }
}
