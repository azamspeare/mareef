<?php

declare(strict_types=1);

namespace App\Http\Controllers\Student\Auth;

use App\Actions\User\CreateUserAction;
use App\Contracts\Enums\RoleEnum;
use App\DTOs\User\LoginDTO;
use App\Http\Controllers\Controller;
use App\Queries\User\UserFindByEmailQuery;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\AbstractProvider;
use Laravel\Socialite\Two\GoogleProvider;
use Throwable;

final class StudentAuthController extends Controller
{
    protected AbstractProvider $driver;

    public function __construct()
    {
        $this->driver = Socialite::buildProvider(GoogleProvider::class, [
            'client_id' => config('services.google.client_id'),
            'client_secret' => config('services.google.client_secret'),
            'redirect' => config('services.google.student_redirect'),
        ]);
    }

    /**
     * Handling the request to redirect to the provider's authentication page.
     *
     * @return RedirectResponse
     */
    public function redirect()
    {
        // Only set intended URL from referer if no task page URL is already stored
        if (! session()->has('student_auth_intended') && request()->headers->has('referer')) {
            $referer = request()->headers->get('referer');
            $intendedUrl = parse_url($referer, PHP_URL_PATH) ?? '/';
            session()->put('student_auth_intended', $intendedUrl);
        }

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
                // User exists - check if they have access to the student portal
                if (! $user->isStudent()) {
                    // Get the intended URL from session or fallback to home
                    $intendedUrl = session()->pull('student_auth_intended', '/');

                    return redirect()
                        ->to($intendedUrl)
                        ->with('error', 'This account is not registered as a student. Please use the correct login method.');
                }

                Auth::login($user, true);

                // Get the intended URL from session or fallback to home
                $intendedUrl = session()->pull('student_auth_intended', '/');

                return redirect()
                    ->to($intendedUrl)
                    ->with('success', 'Welcome back! You have successfully logged in.');
            }

            $newUser = $action->run(LoginDTO::make($socialiteUser, RoleEnum::STUDENT));

            if (! $newUser) {
                // Get the intended URL from session or fallback to home
                $intendedUrl = session()->pull('student_auth_intended', '/');

                return redirect()
                    ->to($intendedUrl)
                    ->with('error', 'Unable to create your account. Please try again.');
            }

            // Log in the newly created user
            Auth::login($newUser, true);

            // Get the intended URL from session or fallback to home
            $intendedUrl = session()->pull('student_auth_intended', '/');

            return redirect()
                ->to($intendedUrl)
                ->with('success', 'Welcome! Your account has been created successfully.');
        } catch (Throwable $throwable) {
            report($throwable);

            // Get the intended URL from session or fallback to home
            $intendedUrl = session()->pull('student_auth_intended', '/');

            return redirect()
                ->to($intendedUrl)
                ->with('error', 'Authentication failed. Please try again.');
        }
    }
}
