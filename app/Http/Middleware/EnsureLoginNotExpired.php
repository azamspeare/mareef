<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

final class EnsureLoginNotExpired
{
    /**
     * Handle an incoming request.
     *
     * Maximum auto-login duration: 5 days
     *
     * @param Closure(Request): (Response) $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (Auth::check()) {
            $user = Auth::user();

            // Check if last_login_at exists and if it's been more than 5 days
            if ($user->last_login_at && $user->last_login_at->diffInDays(now()) > 5) {
                // The last login was more than 5 days ago, force re-authentication
                Auth::logout();

                $request->session()->invalidate();
                $request->session()->regenerateToken();

                return redirect()->route('login')
                    ->with('message', 'Your session has expired. Please log in again.');
            }
        }

        return $next($request);
    }
}
