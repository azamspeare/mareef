<?php

use App\Contracts\Enums\RoleEnum;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\TeacherAuthController;
use App\Http\Controllers\Dashboard\DashboardController;
use App\Http\Controllers\Landing\LandingController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::domain('app.' . config('app.domain'))->group(function () {
    // Redirect root to dashboard (auto-login if remembered)
    Route::get('/', function () {
        return Auth::check() ? redirect()->route('dashboard') : redirect()->route('login');
    });

    Route::middleware('redirect_if_authenticated')->group(function () {
        Route::get('login', [LoginController::class, 'login'])->name('login');

        Route::prefix('auth')->group(function () {
            Route::get('google/redirect', [TeacherAuthController::class, 'redirect'])->name('google.redirect');
            Route::get('google/callback', [TeacherAuthController::class, 'callback'])->name('google.callback');
        });
    });

    Route::middleware(['auth', 'login_not_expired', 'is_role:' . RoleEnum::TEACHER->value])->group(function () {
        Route::get('dashboard', DashboardController::class)->name('dashboard');

        Route::post('logout', [LoginController::class, 'logout'])->name('logout');
    });
});

Route::get('/', LandingController::class);
