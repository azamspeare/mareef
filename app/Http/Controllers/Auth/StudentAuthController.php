<?php

declare(strict_types=1);

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\AbstractProvider;
use Laravel\Socialite\Two\GoogleProvider;

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

    public function redirect(Request $request)
    {

    }

    public function callback(Request $request)
    {

    }
}
