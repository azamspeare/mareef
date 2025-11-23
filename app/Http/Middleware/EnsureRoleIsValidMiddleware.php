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
     * Handle an incoming request.
     *
     * Verifies that the authenticated user has the required role.
     *
     * @param Closure(Request): (Response) $next
     * @param string $role The role name (ADMIN, TEACHER, STUDENT)
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        // Check if the user is authenticated
        if (!Auth::check()) {
            return redirect()->route('login')
                ->with('error', 'You must be logged in to access this page.');
        }

        $user = Auth::user();

        // Validate that the role parameter is a valid RoleEnum
        $roleEnum = RoleEnum::tryFrom(mb_strtolower($role));

        if (!$roleEnum) {
            abort(500, 'Invalid role configuration.');
        }

        // Check if a user has the required role
        $userRole = mb_strtolower($user->role);

        if ($userRole !== $roleEnum->value) {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return redirect()->route('login')
                ->with('error', 'You do not have permission to access this page.');
        }

        return $next($request);
    }
}
