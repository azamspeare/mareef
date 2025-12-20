<?php

declare(strict_types=1);

namespace Database\Seeders\environments;

use Database\Seeders\defaults\Codes\OtpCodesSeeder;
use Database\Seeders\defaults\Tasks\WritingSeeder;
use Database\Seeders\defaults\User\AdminSeeder;
use Database\Seeders\defaults\User\StudentSeeder;
use Database\Seeders\defaults\User\TeacherSeeder;
use Database\Seeders\defaults\User\TelegramUserSeeder;
use Database\Seeders\defaults\User\WaitlistSeeder;
use Illuminate\Database\Seeder;

final class DatabaseLocalSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->call([
            AdminSeeder::class,
            TeacherSeeder::class,
            StudentSeeder::class,
            TelegramUserSeeder::class,
            OtpCodesSeeder::class,
            WritingSeeder::class,
            WaitlistSeeder::class
        ]);
    }
}
