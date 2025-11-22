<?php

declare(strict_types=1);

namespace Database\Seeders\defaults;

use App\Contracts\Enums\RoleEnum;
use App\Models\User\User;
use Illuminate\Database\Seeder;

final class StudentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::factory()
            ->count(20)
            ->create([
                'role' => RoleEnum::STUDENT->value,
            ]);
    }
}
