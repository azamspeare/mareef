<?php

use App\Contracts\Enums\RoleEnum;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\TeacherAuthController;
use App\Http\Controllers\Dashboard\DashboardController;
use App\Http\Controllers\Dashboard\StudentController;
use App\Http\Controllers\Dashboard\Writing\WritingBulkController;
use App\Http\Controllers\Dashboard\Writing\WritingController;
use App\Http\Controllers\Dashboard\Writing\SubmissionController;
use App\Http\Controllers\Landing\LandingController;
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
        Route::get('students', [StudentController::class, 'index'])->name('students.index');

        Route::prefix('writings')->name('writings.')->group(function () {
            // List & Create (order matters - create before {id})
            Route::get('/', [WritingController::class, 'index'])->name('index');
            Route::get('/create', [WritingController::class, 'create'])->name('create');
            Route::post('/', [WritingController::class, 'store'])->name('store');

            // Bulk operations (before {id} routes)
            Route::patch('/archive', [WritingBulkController::class, 'archive'])->name('archive.bulk');
            Route::patch('/restore', [WritingBulkController::class, 'restore'])->name('restore.bulk');
            Route::delete('/delete', [WritingBulkController::class, 'delete'])->name('delete.bulk');

            // Single resource operations
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

            // Feedback: create and update only (displayed within the submission page)
            Route::post('/{id}/evaluate', [SubmissionController::class, 'evaluate'])->name('feedback.evaluate')->where('id', '[0-9]+');
        });

        Route::post('logout', [LoginController::class, 'logout'])->name('logout');
    });
});

Route::get('/', LandingController::class);
