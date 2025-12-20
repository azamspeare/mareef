<?php

declare(strict_types=1);

namespace Database\Seeders\defaults\User;

use App\Models\Telegram\TelegramUser;
use App\Models\User\User;
use Illuminate\Database\Seeder;

final class TelegramUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Link telegram accounts to some existing users (50% of users)
        $users = User::query()
            ->inRandomOrder()
            ->limit((int) ceil(User::count() / 2))
            ->get();

        foreach ($users as $user) {
            TelegramUser::factory()
                ->linked($user->id)
                ->create([
                    'first_name' => explode(' ', $user->name)[0],
                    'last_name' => explode(' ', $user->name)[1] ?? null,
                ]);
        }

        // Create some unlinked telegram users (users who started bot but haven't verified)
        TelegramUser::factory()
            ->count(5)
            ->unlinked()
            ->create();
    }
}
