<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;

final class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     */
    protected function redirectTo(Request $request): ?string
    {
        if ($request->expectsJson()) {
            return null;
        }

        $appDomain = ltrim((string) config('app.domain'), '.');

        if ($request->getHost() === 'student.' . $appDomain) {
            return route('auth.google.redirect');
        }

        return route('login');
    }
}
