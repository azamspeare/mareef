<?php

declare(strict_types=1);

namespace App\Providers;

use App\Listeners\UpdateLastLoginTimestamp;
use Illuminate\Auth\Events\Login;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\ServiceProvider;

final class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Update last_login_at on every login (manual and auto-login)
        Event::listen(Login::class, UpdateLastLoginTimestamp::class);
    }
}
