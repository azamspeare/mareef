<?php

declare(strict_types=1);

use App\Listeners\UpdateLastLoginTimestamp;
use App\Models\User\User;
use Illuminate\Auth\Events\Login;
use Illuminate\Support\Facades\Event;

test('last_login_at is updated when login event fires', function () {
    $user = User::factory()->create([
        'last_login_at' => now()->subDays(2),
    ]);

    $oldLoginTime = $user->last_login_at;

    // Simulate login event
    $event = new Login('web', $user, false);
    $listener = new UpdateLastLoginTimestamp();
    $listener->handle($event);

    $user->refresh();

    expect($user->last_login_at)->not->toEqual($oldLoginTime)
        ->and($user->last_login_at->isToday())->toBeTrue();
});

test('listener handles null user gracefully', function () {
    $event = new Login('web', null, false);
    $listener = new UpdateLastLoginTimestamp();

    // Should not throw exception
    $listener->handle($event);

    expect(true)->toBeTrue();
});

test('listener updates last_login_at to current timestamp', function () {
    $user = User::factory()->create([
        'last_login_at' => null,
    ]);

    expect($user->last_login_at)->toBeNull();

    $event = new Login('web', $user, false);
    $listener = new UpdateLastLoginTimestamp();
    $listener->handle($event);

    $user->refresh();

    expect($user->last_login_at)->not->toBeNull()
        ->and($user->last_login_at->isToday())->toBeTrue();
});
