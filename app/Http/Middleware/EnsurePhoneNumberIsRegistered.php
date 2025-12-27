<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

final class EnsurePhoneNumberIsRegistered
{
    /**
     * Handle an incoming request.
     *
     * Redirects authenticated users without a phone number or unverified to the registration page.
     *
     * @param Closure(Request): (Response) $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();

        if ($user && ! $user->phone_number) {
            return redirect()->route('register.phone-number');
        }

        if ($user && $user->phone_number && ! $user->email_verified_at) {
            return redirect()->route('register.otp');
        }

        return $next($request);
    }
}
