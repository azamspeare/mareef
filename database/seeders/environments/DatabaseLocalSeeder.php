<?php

declare(strict_types=1);

namespace Database\Seeders\environments;

use Database\Seeders\defaults\AdminSeeder;
use Database\Seeders\defaults\StudentSeeder;
use Database\Seeders\defaults\TeacherSeeder;
use Database\Seeders\defaults\WaitlistSeeder;
use Database\Seeders\defaults\WritingSeeder;
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
            WritingSeeder::class,
            WaitlistSeeder::class
        ]);
    }
}
