<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

final class RedirectIfPhoneNumberRegistered
{
    /**
     * Handle an incoming request.
     *
     * Redirects authenticated users who already have a phone number and are verified away from registration routes.
     *
     * @param Closure(Request): (Response) $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();

        if ($user && $user->phone_number && $user->email_verified_at) {
            if ($user->isStudent()) {
                $intendedUrl = session()->pull('student_auth_intended', '/');

                return redirect()->to($intendedUrl);
            }

            return redirect()->route('dashboard');
        }

        return $next($request);
    }
}
