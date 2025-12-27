<?php

declare(strict_types=1);

namespace Database\Seeders\defaults\Codes;

use App\Models\OtpCode\OtpCode;
use App\Models\User\User;
use Illuminate\Database\Seeder;

final class OtpCodesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get some users without linked telegram accounts for testing OTP flow
        $usersWithoutTelegram = User::query()
            ->whereDoesntHave('telegramUser')
            ->inRandomOrder()
            ->limit(5)
            ->get();

        // Create valid OTP codes for some users
        foreach ($usersWithoutTelegram->take(3) as $user) {
            OtpCode::factory()
                ->for($user)
                ->validFor(5)
                ->create();
        }

        // Create expired OTP codes for testing expiration handling
        foreach ($usersWithoutTelegram->skip(3) as $user) {
            OtpCode::factory()
                ->for($user)
                ->expired()
                ->create();
        }
    }
}
