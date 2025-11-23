<?php

declare(strict_types=1);

namespace App\Http\Controllers\Auth;

use App\Actions\User\CreateUserAction;
use App\Contracts\Enums\RoleEnum;
use App\DTOs\User\RegisterDTO;
use App\Http\Controllers\Controller;
use App\Queries\User\UserFindByEmailQuery;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\AbstractProvider;
use Laravel\Socialite\Two\GoogleProvider;
use Throwable;

final class TeacherAuthController extends Controller
{
    protected AbstractProvider $driver;

    public function __construct()
    {
        $this->driver = Socialite::buildProvider(GoogleProvider::class, [
            'client_id' => config('services.google.client_id'),
            'client_secret' => config('services.google.client_secret'),
            'redirect' => config('services.google.app_redirect'),
        ]);
    }

    /**
     * Handling the request to redirect to the provider's authentication page.
     *
     * @return RedirectResponse
     */
    public function redirect(): RedirectResponse
    {
        return $this->driver->redirect();
    }

    /**
     * Handling the request to get the user's information from the provider.
     *
     * @param UserFindByEmailQuery $query
     * @param CreateUserAction $action
     *
     * @return RedirectResponse
     */
    public function callback(UserFindByEmailQuery $query, CreateUserAction $action): RedirectResponse
    {
        try {
            \Log::info('TeacherAuth: Starting Google OAuth callback');

            $socialiteUser = $this->driver->user();
            $email = mb_strtolower($socialiteUser->getEmail());

            \Log::info('TeacherAuth: Retrieved user from Google', [
                'email' => $email,
                'name' => $socialiteUser->getName(),
            ]);

            // Check if a user already exists
            $user = $query->query(['email' => $email]);

            if ($user) {
                \Log::info('TeacherAuth: User found in database', [
                    'user_id' => $user->id,
                    'email' => $user->email,
                    'role' => $user->role,
                    'is_teacher' => $user->isTeacher(),
                    'is_admin' => $user->isAdmin(),
                ]);

                // User exists - check if they have access to teacher portal (teacher or admin)
                if (! $user->isTeacher() && ! $user->isAdmin()) {
                    \Log::warning('TeacherAuth: User is not a teacher or admin', [
                        'user_id' => $user->id,
                        'role' => $user->role,
                    ]);

                    return redirect()
                        ->route('login')
                        ->with('error', 'This account is not registered as a teacher. Please use the correct login method.');
                }

                // User is a teacher or admin - log them in
                \Log::info('TeacherAuth: Logging in existing user', [
                    'user_id' => $user->id,
                ]);

                Auth::login($user, true);

                \Log::info('TeacherAuth: User logged in successfully', [
                    'user_id' => $user->id,
                    'auth_check' => Auth::check(),
                    'auth_id' => Auth::id(),
                ]);

                return redirect()->route('dashboard');
            }

            // User doesn't exist - create a new teacher account
            \Log::info('TeacherAuth: User not found, creating new teacher account', [
                'email' => $email,
            ]);

            $newUser = $action->run(RegisterDTO::make($socialiteUser, RoleEnum::TEACHER));

            if (! $newUser) {
                \Log::error('TeacherAuth: Failed to create new user', [
                    'email' => $email,
                ]);

                return redirect()
                    ->route('login')
                    ->with('error', 'Unable to create your account. Please try again.');
            }

            \Log::info('TeacherAuth: New user created successfully', [
                'user_id' => $newUser->id,
                'email' => $newUser->email,
                'role' => $newUser->role,
            ]);

            // Log in the newly created user
            Auth::login($newUser, true);

            \Log::info('TeacherAuth: New user logged in successfully', [
                'user_id' => $newUser->id,
                'auth_check' => Auth::check(),
                'auth_id' => Auth::id(),
            ]);

            return redirect()->route('dashboard');
        } catch (Throwable $throwable) {
            \Log::error('TeacherAuth: Exception in callback', [
                'message' => $throwable->getMessage(),
                'file' => $throwable->getFile(),
                'line' => $throwable->getLine(),
                'trace' => $throwable->getTraceAsString(),
            ]);

            report($throwable);

            return redirect()
                ->route('login')
                ->with('error', 'Authentication failed. Please try again.');
        }
    }
}
