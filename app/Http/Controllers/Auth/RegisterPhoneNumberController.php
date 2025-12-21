<?php

declare(strict_types=1);

namespace App\Http\Controllers\Auth;

use App\DTOs\User\PhoneNumberDTO;
use App\Handlers\ServiceHandler;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\StorePhoneNumberRequest;
use App\Services\Register\RegisterPhoneNumberService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Response;

final class RegisterPhoneNumberController extends Controller
{
    public function create(Request $request): Response
    {
        $user = $request->user();

        return inertia('Auth/PhoneNumber', [
            'phone_number' => $user->phone_number
        ]);
    }

    public function store(StorePhoneNumberRequest $request, ServiceHandler $handler): RedirectResponse
    {
        $user = $request->user();
        $attributes = $request->validated();

        $dto = PhoneNumberDTO::make($attributes['phone_number']);

        $result = $handler->handle(new RegisterPhoneNumberService($user, $dto));
        if (! $result) {
            return redirect()->back()->withErrors(['message' => 'Failed to register phone number.']);
        }

        return redirect()->route('register.otp');
    }
}
