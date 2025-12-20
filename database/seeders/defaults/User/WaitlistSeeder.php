<?php

declare(strict_types=1);

namespace Database\Seeders\defaults\User;

use App\Models\Waitlist\Waitlist;
use Illuminate\Database\Seeder;

final class WaitlistSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Waitlist::factory()->count(10)->create();
    }
}
