<?php

declare(strict_types=1);

namespace Database\Seeders;

use Database\Seeders\environments\DatabaseLocalSeeder;
use Database\Seeders\environments\DatabaseProdSeeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

final class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        if (app()->environment('local')) {
            $this->call(DatabaseLocalSeeder::class);
        } else {
            $this->call(DatabaseProdSeeder::class);
        }
    }
}
