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
            $socialiteUser = $this->driver->user();
            $email = mb_strtolower($socialiteUser->getEmail());

            // Check if a user already exists
            $user = $query->query(['email' => $email]);

            if ($user) {
                // User exists - check if they're trying to log in as a teacher
                if (! $user->isTeacher()) {
                    return redirect()
                        ->route('login')
                        ->with('error', 'This account is not registered as a teacher. Please use the correct login method.');
                }

                // User is a teacher - log them in (last_login_at updated by event listener)
                Auth::login($user, true);

                return redirect()->route('dashboard');
            }

            // User doesn't exist - create a new teacher account
            $newUser = $action->run(RegisterDTO::make($socialiteUser, RoleEnum::TEACHER));

            if (! $newUser) {
                return redirect()
                    ->route('login')
                    ->with('error', 'Unable to create your account. Please try again.');
            }

            // Log in the newly created user (last_login_at updated by event listener)
            Auth::login($newUser, true);

            return redirect()->route('dashboard');
        } catch (Throwable $throwable) {
            report($throwable);

            return redirect()
                ->route('login')
                ->with('error', 'Authentication failed. Please try again.');
        }
    }
}
