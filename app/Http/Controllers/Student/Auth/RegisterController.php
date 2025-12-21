<?php

declare(strict_types=1);

namespace App\Http\Controllers\Student\Auth;

use App\Contracts\Enums\RoleEnum;
use App\DTOs\User\RegisterDTO;
use App\Handlers\ServiceHandler;
use App\Http\Controllers\Controller;
use App\Http\Requests\Student\Auth\RegisterRequest;
use App\Services\Register\RegisterStudentService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

final class RegisterController extends Controller
{
    public function create(): Response
    {
        if (request()->headers->has('referer')) {
            $referer = request()->headers->get('referer');
            $intendedUrl = parse_url($referer, PHP_URL_PATH) ?? '/';
            session()->put('student_auth_intended', $intendedUrl);
        }

        return Inertia::render('Student/Auth/Register');
    }

    public function store(RegisterRequest $request, ServiceHandler $handler): RedirectResponse
    {
        $attributes = $request->validated();

        $dto = RegisterDTO::make($attributes, RoleEnum::STUDENT);

        $result = $handler->handle(new RegisterStudentService($dto));
        if (! $result) {
            return redirect()->back()->withErrors(['message' => 'Failed to register. Try again later.']);
        }

        Auth::login($result['data']);

        return redirect()->route('register.otp');
    }
}
