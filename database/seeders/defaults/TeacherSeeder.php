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
        User::query()
            ->create([
                'name' => "A'zam Maxsudov",
                'email' => 'abduazamdev@gmail.com',
                'username' => 'abduazamdev',
                'email_verified_at' => now(),
                'role' => RoleEnum::TEACHER->value,
                'avatar' => "https://lh3.googleusercontent.com/a/ACg8ocJeqBWubgaV9te0T8FkFIVqEAQQbu2VBte7z73A895LB2w9A7d0=s96-c"
            ]);

        User::factory()
            ->count(4)
            ->create([
                'role' => RoleEnum::TEACHER->value,
            ]);
    }
}
