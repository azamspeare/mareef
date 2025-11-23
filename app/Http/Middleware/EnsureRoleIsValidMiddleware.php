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
        \Log::info('RoleMiddleware: Checking user role', [
            'required_role' => $role,
            'url' => $request->url(),
            'auth_check' => Auth::check(),
        ]);

        // Check if the user is authenticated
        if (!Auth::check()) {
            \Log::warning('RoleMiddleware: User not authenticated');

            return redirect()->route('login')->with('error', 'You must be logged in to access this page.');
        }

        $user = Auth::user();

        \Log::info('RoleMiddleware: User authenticated', [
            'user_id' => $user->id,
            'user_email' => $user->email,
            'user_role' => $user->role,
        ]);

        // Validate that the role parameter is a valid RoleEnum
        $roleEnum = RoleEnum::tryFrom(mb_strtolower($role));

        if (! $roleEnum) {
            \Log::error('RoleMiddleware: Invalid role configuration', [
                'role' => $role,
            ]);

            abort(500, 'Invalid role configuration.');
        }

        \Log::info('RoleMiddleware: Role validation', [
            'required_role' => $roleEnum->value,
            'user_role' => mb_strtolower($user->role),
        ]);

        // Check if a user has the required role
        $userRole = mb_strtolower($user->role);

        if ($userRole !== $roleEnum->value) {
            \Log::warning('RoleMiddleware: User role does not match required role', [
                'user_id' => $user->id,
                'user_role' => $userRole,
                'required_role' => $roleEnum->value,
            ]);

            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return redirect()->route('login')->with('error', 'You do not have permission to access this page.');
        }

        \Log::info('RoleMiddleware: Role check passed, allowing access');

        return $next($request);
    }
}
