<?php

declare(strict_types=1);

namespace App\Http\Controllers\Auth;

use App\DTOs\User\OTPCodeDTO;
use App\Handlers\ServiceHandler;
use App\Http\Controllers\Controller;
use App\Http\Requests\Register\VerifyOTPCodeRequest;
use App\Services\Register\VerifyOTPCodeService;
use Illuminate\Http\RedirectResponse;
use Inertia\Response;

final class VerifyOTPCodeController extends Controller
{
    public function create(): Response
    {
        return inertia('Auth/Register/OTP');
    }

    public function store(VerifyOTPCodeRequest $request, ServiceHandler $handler): RedirectResponse
    {
        $user = $request->user();
        $attributes = $request->validated();

        $dto = OTPCodeDTO::make($attributes['code']);

        $result = $handler->handle(new VerifyOTPCodeService($user, $dto));
        if (! $result) {
            return redirect()->back()->withErrors(['code' => $handler->getError('Failed to verify OTP code.')]);
        }

        if ($user->isStudent()) {
            $intendedUrl = session()->pull('student_auth_intended', '/');

            return redirect()->to($intendedUrl)->with('success', 'Your account has been verified successfully.');
        }

        return redirect()->route('dashboard')->with('success', 'Your account has been verified successfully.');
    }
}
