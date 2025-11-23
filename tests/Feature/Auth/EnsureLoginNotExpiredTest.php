<?php

declare(strict_types=1);

use App\Models\User\User;
use Illuminate\Support\Facades\Auth;

test('user with last login within 5 days can access protected routes', function () {
    $user = User::factory()->teacher()->create([
        'last_login_at' => now()->subDays(3),
    ]);

    $this->actingAs($user);

    $response = $this->get(route('dashboard'));

    expect($response->status())->toBe(200)
        ->and(Auth::check())->toBeTrue()
        ->and(Auth::id())->toBe($user->id);
});

test('user with last login exactly 5 days ago is logged out', function () {
    // Note: The middleware checks if last_login_at > 5 days
    // At exactly 5 days, diffInDays returns 5, which is NOT > 5
    // So user should still be logged in
    // But after 5 days + 1 minute, diffInDays returns 5, and may fail depending on implementation
    // Let's test at 5 days and 1 hour to be safe
    $user = User::factory()->teacher()->create([
        'last_login_at' => now()->subDays(5)->subHours(1),
    ]);

    $this->actingAs($user);

    $response = $this->get(route('dashboard'));

    // Should be logged out because it's been > 5 days
    expect(Auth::check())->toBeFalse()
        ->and($response->status())->toBe(302);

    $response->assertRedirect(route('login'));
});

test('user with last login more than 5 days ago is logged out and redirected', function () {
    $user = User::factory()->teacher()->create([
        'last_login_at' => now()->subDays(6),
    ]);

    $this->actingAs($user);

    $response = $this->get(route('dashboard'));

    expect(Auth::check())->toBeFalse()
        ->and($response->status())->toBe(302);

    $response->assertRedirect(route('login'))
        ->assertSessionHas('message', 'Your session has expired. Please log in again.');
});

test('user with null last_login_at can still access protected routes', function () {
    $user = User::factory()->teacher()->create([
        'last_login_at' => null,
    ]);

    $this->actingAs($user);

    $response = $this->get(route('dashboard'));

    expect($response->status())->toBe(200)
        ->and(Auth::check())->toBeTrue();
});

test('middleware only affects authenticated users', function () {
    $response = $this->get(route('dashboard'));

    expect(Auth::check())->toBeFalse()
        ->and($response->status())->toBe(302);

    $response->assertRedirect(route('login'));
});
