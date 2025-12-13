<?php

declare(strict_types=1);

namespace App\Observers\User;

use App\Mail\Teacher\WelcomeTeacher;
use App\Models\User\User;
use Illuminate\Support\Facades\Mail;

final class UserObserver
{
    /**
     * Handle the User "created" event.
     */
    public function created(User $user): void
    {
        defer(function () use ($user) {
            if ($user->isTeacher()) {
                Mail::to($user->email)->send(new WelcomeTeacher($user));
            }
        });
    }

    /**
     * Handle the User "updated" event.
     */
    public function updated(User $user): void
    {
        //
    }

    /**
     * Handle the User "deleted" event.
     */
    public function deleted(User $user): void
    {
        //
    }

    /**
     * Handle the User "restored" event.
     */
    public function restored(User $user): void
    {
        //
    }

    /**
     * Handle the User "force deleted" event.
     */
    public function forceDeleted(User $user): void
    {
        //
    }
}
