<?php

declare(strict_types=1);

namespace App\Http\Controllers\Student\Auth;

use App\Contracts\Enums\RoleEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\Student\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

final class LoginController extends Controller
{
    public function create(): Response
    {
        if (request()->headers->has('referer')) {
            $referer = request()->headers->get('referer');
            $intendedUrl = parse_url($referer, PHP_URL_PATH) ?? '/';
            session()->put('student_auth_intended', $intendedUrl);
        }

        return Inertia::render('Student/Auth/Login');
    }

    public function store(LoginRequest $request): RedirectResponse
    {
        $credentials = $request->validated();

        if (! Auth::attempt($credentials)) {
            return redirect()->back()->withErrors([
                'email' => 'The provided credentials do not match our records.',
            ]);
        }

        $user = Auth::user();

        if ($user->role !== RoleEnum::STUDENT->value) {
            Auth::logout();

            return redirect()->back()->withErrors([
                'email' => 'This account is not registered as a student.',
            ]);
        }

        $request->session()->regenerate();

        $intendedUrl = session()->pull('student_auth_intended', '/');

        return redirect()->intended($intendedUrl);
    }

    public function destroy(): RedirectResponse
    {
        Auth::logout();

        request()->session()->invalidate();
        request()->session()->regenerateToken();

        return redirect()->route('student.auth.login');
    }
}
