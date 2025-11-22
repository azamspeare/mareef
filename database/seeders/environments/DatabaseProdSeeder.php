<?php

declare(strict_types=1);

namespace Database\Seeders\environments;

use Database\Seeders\defaults\AdminSeeder;
use Illuminate\Database\Seeder;

final class DatabaseProdSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->call([
            AdminSeeder::class
        ]);
    }
}
