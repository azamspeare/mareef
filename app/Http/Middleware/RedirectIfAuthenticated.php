<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

final class RedirectIfAuthenticated
{
    /**
     * Handle an incoming request.
     *
     * @param Closure(Request): (Response) $next
     */
    public function handle(Request $request, Closure $next, string ...$guards): Response
    {
        \Log::info('RedirectIfAuthenticated: Checking if user is already authenticated', [
            'url' => $request->url(),
            'guards' => $guards,
        ]);

        $guards = empty($guards) ? [null] : $guards;

        foreach ($guards as $guard) {
            if (Auth::guard($guard)->check()) {
                $user = Auth::guard($guard)->user();

                \Log::info('RedirectIfAuthenticated: User is authenticated, redirecting to dashboard', [
                    'guard' => $guard,
                    'user_id' => $user?->id,
                    'user_email' => $user?->email,
                ]);

                // User is authenticated, redirect to dashboard
                return redirect()->route('dashboard');
            }
        }

        \Log::info('RedirectIfAuthenticated: User not authenticated, allowing access');

        return $next($request);
    }
}
