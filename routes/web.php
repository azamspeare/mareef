<?php

use App\Contracts\Enums\RoleEnum;
use App\Http\Controllers\Auth\RegisterPhoneNumberController;
use App\Http\Controllers\Auth\VerifyOTPCodeController;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\Landing\LandingController;
use App\Http\Controllers\Student\Auth\RegisterController;
use App\Http\Controllers\Student\Auth\StudentAuthController;
use App\Http\Controllers\Student\WritingTaskController;
use App\Http\Controllers\Teacher\Auth\LoginController as LoginTeacherController;
use App\Http\Controllers\Student\Auth\LoginController as LoginStudentController;
use App\Http\Controllers\Teacher\Auth\TeacherAuthController;
use App\Http\Controllers\Teacher\DashboardController;
use App\Http\Controllers\Teacher\StudentController;
use App\Http\Controllers\Teacher\Writing\SubmissionController;
use App\Http\Controllers\Teacher\Writing\WritingBulkController;
use App\Http\Controllers\Teacher\Writing\WritingController;
use App\Http\Controllers\WaitlistController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::domain('app.' . config('app.domain'))->group(function () {
    Route::get('/', function () {
        return Auth::check() ? redirect()->route('dashboard') : redirect()->route('login');
    });

    Route::middleware(['guest'])->group(function () {
        Route::get('login', [LoginTeacherController::class, 'login'])->name('login');

        Route::prefix('auth')->group(function () {
            Route::get('google/redirect', [TeacherAuthController::class, 'redirect'])->name('google.redirect');
            Route::get('google/callback', [TeacherAuthController::class, 'callback'])->name('google.callback')->middleware('throttle:auth');
        });
    });

    Route::middleware(['auth', 'is_role:' . RoleEnum::TEACHER->value, 'phone_registered'])->group(function () {
        Route::get('dashboard', DashboardController::class)->name('dashboard');

        Route::prefix('students')->name('students.')->group(function () {
            Route::get('/', [StudentController::class, 'index'])->name('index');
            Route::get('/{id}', [StudentController::class, 'show'])->name('show')->where('id', '[0-9]+');
        });

        Route::prefix('writings')->name('writings.')->group(function () {
            Route::get('/', [WritingController::class, 'index'])->name('index');
            Route::get('/create', [WritingController::class, 'create'])->name('create');
            Route::post('/', [WritingController::class, 'store'])->name('store');

            Route::patch('/archive', [WritingBulkController::class, 'archive'])->name('archive.bulk');
            Route::patch('/restore', [WritingBulkController::class, 'restore'])->name('restore.bulk');

            Route::get('/{id}', [WritingController::class, 'show'])->name('show')->where('id', '[0-9]+');
            Route::get('/{id}/edit', [WritingController::class, 'edit'])->name('edit')->where('id', '[0-9]+');
            Route::put('/{id}', [WritingController::class, 'update'])->name('update')->where('id', '[0-9]+');
            Route::patch('/{id}/archive', [WritingController::class, 'archive'])->name('archive')->where('id', '[0-9]+');
            Route::patch('/{id}/restore', [WritingController::class, 'restore'])->name('restore')->where('id', '[0-9]+');
            Route::delete('/{id}', [WritingController::class, 'delete'])->name('delete')->where('id', '[0-9]+');
        });

        Route::prefix('submissions')->name('submissions.')->group(function () {
            Route::get('/', [SubmissionController::class, 'index'])->name('index');
            Route::get('/{id}', [SubmissionController::class, 'show'])->name('show')->where('id', '[0-9]+');
            Route::post('/{id}/evaluate', [SubmissionController::class, 'evaluate'])->name('evaluate')->where('id', '[0-9]+');
            Route::patch('/{id}/archive', [SubmissionController::class, 'archive'])->name('archive')->where('id', '[0-9]+');
        });

        Route::post('logout', [LoginTeacherController::class, 'destroy'])->name('logout');
    });
});

Route::domain('student.' . config('app.domain'))->name('student.')->group(function () {
    Route::get('/', [LandingController::class, 'welcome']);

    Route::middleware(['guest'])->group(function () {
        Route::prefix('auth')->name('auth.')->group(function () {
            Route::get('register', [RegisterController::class, 'create'])->name('register');
            Route::post('register', [RegisterController::class, 'store'])->name('register.store');

            Route::get('login', [LoginStudentController::class, 'create'])->name('login');
            Route::post('login', [LoginStudentController::class, 'store'])->name('login.store');

            Route::get('google/redirect', [StudentAuthController::class, 'redirect'])->name('google.redirect');
            Route::get('google/callback', [StudentAuthController::class, 'callback'])->name('google.callback')->middleware('throttle:auth');
        });
    });

    Route::prefix('tasks')->name('tasks.')->group(function () {
        Route::get('/{handle}/writing/{slug}', [WritingTaskController::class, 'create'])->name('writing');

        Route::middleware(['auth', 'is_role:' . RoleEnum::STUDENT->value, 'phone_registered'])->group(function () {
            Route::prefix('submissions')->name('submissions.')->group(function () {
                Route::post('start', [WritingTaskController::class, 'start'])->name('start')->middleware('throttle:api');
                Route::post('save', [WritingTaskController::class, 'update'])->name('save')->middleware('throttle:auto-save');
                Route::post('finish', [WritingTaskController::class, 'finish'])->name('finish')->middleware('throttle:api');
            });
        });
    });

    Route::middleware(['auth'])->group(function () {
        Route::post('logout', [LoginStudentController::class, 'destroy'])->name('auth.logout');
    });
});

Route::get('/', [LandingController::class, 'welcome'])->name('landing');
Route::get('pricing', [LandingController::class, 'pricing'])->name('pricing');
Route::post('waitlist', WaitlistController::class)->name('waitlist');
Route::prefix('tasks')->name('tasks.')->group(function () {
    Route::get('listening', [LandingController::class, 'listening'])->name('listening');
    Route::get('reading', [LandingController::class, 'reading'])->name('reading');
    Route::get('writing', [LandingController::class, 'writing'])->name('writing');
    Route::get('speaking', [LandingController::class, 'speaking'])->name('speaking');
});
Route::prefix('images')->name('images.')->group(function () {
    Route::post('upload', [ImageController::class, 'store'])->name('store')->middleware(['auth', 'throttle:uploads']);
    Route::get('{filename}', [ImageController::class, 'show'])->name('show');
});

Route::prefix('register')->name('register.')->middleware(['auth', 'redirect_if_phone_registered'])->group(function () {
    Route::get('phone-number', [RegisterPhoneNumberController::class, 'create'])->name('phone-number');
    Route::post('phone-number', [RegisterPhoneNumberController::class, 'store'])->name('phone-number.store');
    Route::get('otp', [VerifyOTPCodeController::class, 'create'])->name('otp');
    Route::post('otp', [VerifyOTPCodeController::class, 'store'])->name('otp.store');
});
