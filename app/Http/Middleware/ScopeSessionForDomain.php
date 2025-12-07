<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

final class ScopeSessionForDomain
{
    /**
     * Scope session / auth cookies and guard to the current host,
     * so teacher / student subdomains cannot share state.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $host = $request->getHost();
        $appDomain = ltrim((string) config('app.domain'), '.');

        $teacherHost = 'app.' . $appDomain;
        $studentHost = 'student.' . $appDomain;

        $guard = match (true) {
            $host === $teacherHost => 'teacher',
            $host === $studentHost => 'student',
            default => (string) config('auth.defaults.guard', 'web'),
        };

        $cookiePrefix = Str::slug((string) config('app.name'), '_');

        config([
            'session.domain' => $host,
            'session.cookie' => "{$cookiePrefix}_" . Str::slug($guard, '_') . '_session',
        ]);

        Auth::shouldUse($guard);

        return $next($request);
    }
}
