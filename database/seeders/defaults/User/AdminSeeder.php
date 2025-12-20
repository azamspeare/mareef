<?php

declare(strict_types=1);

namespace Database\Seeders\defaults\User;

use App\Contracts\Enums\RoleEnum;
use App\Models\User\User;
use Illuminate\Database\Seeder;

final class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = [
            'name' => 'Admin',
            'email' => 'admin@mareef.uz',
            'username' => 'admin',
            'email_verified_at' => now(),
            'password' => 'password',
            'role' => RoleEnum::ADMIN->value,
        ];

        User::query()->create($admin);
    }
}
