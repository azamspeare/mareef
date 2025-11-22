<?php

declare(strict_types=1);

namespace Database\Seeders\defaults;

use App\Contracts\Enums\RoleEnum;
use App\Models\User\User;
use Illuminate\Database\Seeder;

final class TeacherSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::factory()
            ->count(5)
            ->create([
                'role' => RoleEnum::TEACHER->value,
            ]);
    }
}
