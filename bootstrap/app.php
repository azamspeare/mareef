<?php

declare(strict_types=1);

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Sentry\Laravel\Integration;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
        ]);

        $middleware->alias([
            'is_role' => \App\Http\Middleware\EnsureRoleIsValidMiddleware::class,
            'redirect_if_authenticated' => \App\Http\Middleware\RedirectIfAuthenticated::class,
            'phone_registered' => \App\Http\Middleware\EnsurePhoneNumberIsRegistered::class,
            'redirect_if_phone_registered' => \App\Http\Middleware\RedirectIfPhoneNumberRegistered::class,
        ]);

        $middleware->validateCsrfTokens(except: [
            'images/upload',
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        Integration::handles($exceptions);
    })->create();
