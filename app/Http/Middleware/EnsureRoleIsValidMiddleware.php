<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Contracts\Enums\RoleEnum;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

final class EnsureRoleIsValidMiddleware
{
    /**
     * @param Closure(Request): (Response) $next
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        if (! Auth::check()) {
            return redirect()->route('login')->with('error', 'You must be logged in to access this page.');
        }

        $user = Auth::user();
        $roleEnum = RoleEnum::tryFrom(mb_strtolower($role));

        if (! $roleEnum) {
            abort(500, 'Invalid role configuration.');
        }

        if (mb_strtolower($user->role) !== $roleEnum->value) {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return redirect()->route('login')->with('error', 'You do not have permission to access this page.');
        }

        return $next($request);
    }
}
