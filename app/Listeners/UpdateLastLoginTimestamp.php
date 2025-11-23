<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Models\User\User;
use Illuminate\Auth\Events\Login;

final class UpdateLastLoginTimestamp
{
    /**
     * Handle the event.
     *
     * Updates last_login_at timestamp whenever a user logs in
     * (both manual OAuth login and automatic remember token login)
     */
    public function handle(Login $event): void
    {
        /** @var User|null $user */
        $user = $event->user;

        if (! $user) {
            return;
        }

        $user->update([
            'last_login_at' => now(),
        ]);
    }
}
