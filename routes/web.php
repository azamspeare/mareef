<?php

use App\Contracts\Enums\RoleEnum;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\StudentAuthController;
use App\Http\Controllers\Auth\TeacherAuthController;
use App\Http\Controllers\Dashboard\DashboardController;
use App\Http\Controllers\Dashboard\StudentController;
use App\Http\Controllers\Dashboard\Writing\SubmissionController;
use App\Http\Controllers\Dashboard\Writing\WritingBulkController;
use App\Http\Controllers\Dashboard\Writing\WritingController;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\Landing\LandingController;
use App\Http\Controllers\Student\WritingController as StudentWritingController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::domain('app.' . config('app.domain'))->group(function () {
    Route::get('/', function () {
        return Auth::check() ? redirect()->route('dashboard') : redirect()->route('login');
    });

    Route::middleware('guest')->group(function () {
        Route::get('login', [LoginController::class, 'login'])->name('login');

        Route::prefix('auth')->group(function () {
            Route::get('google/redirect', [TeacherAuthController::class, 'redirect'])->name('google.redirect');
            Route::get('google/callback', [TeacherAuthController::class, 'callback'])->name('google.callback');
        });
    });

    Route::middleware(['auth', 'is_role:' . RoleEnum::TEACHER->value])->group(function () {
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

        Route::post('logout', [LoginController::class, 'logout'])->name('logout');
    });
});

Route::domain('student.' . config('app.domain'))->group(function () {
    Route::get('/', LandingController::class);

    Route::middleware('guest')->group(function () {
        Route::prefix('auth')->name('auth.')->group(function () {
            Route::get('google/redirect', [StudentAuthController::class, 'redirect'])->name('google.redirect');
            Route::get('google/callback', [StudentAuthController::class, 'callback'])->name('google.callback');
        });
    });

    Route::prefix('tasks')->name('tasks.')->group(function () {
        Route::get('/{handle}/writing/{slug}', [StudentWritingController::class, 'create'])->name('writing');

        Route::middleware(['auth', 'is_role:' . RoleEnum::STUDENT->value])->group(function () {
            Route::prefix('submissions')->name('submissions.')->group(function () {
                Route::post('start', [StudentWritingController::class, 'start'])->name('start');
                Route::post('save', [StudentWritingController::class, 'update'])->name('save');
                Route::post('finish', [StudentWritingController::class, 'finish'])->name('finish');
            });
        });
    });
});

Route::get('/', LandingController::class);
Route::prefix('images')->name('images.')->group(function () {
    Route::post('upload', [ImageController::class, 'store'])->name('store')->middleware('auth');
    Route::get('{filename}', [ImageController::class, 'show'])->name('show');
});
