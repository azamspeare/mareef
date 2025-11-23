<?php

declare(strict_types=1);

use App\Models\User\User;

test('authenticated user is redirected from login page to dashboard', function () {
    $user = User::factory()->teacher()->create();

    $this->actingAs($user);

    $response = $this->get(route('login'));

    expect($response->status())->toBe(302);
    $response->assertRedirect(route('dashboard'));
});

test('guest user can access login page', function () {
    $response = $this->get(route('login'));

    expect($response->status())->toBe(200);
});

test('authenticated user is redirected from OAuth routes', function () {
    $user = User::factory()->teacher()->create();

    $this->actingAs($user);

    $response = $this->get(route('google.redirect'));

    expect($response->status())->toBe(302);
    $response->assertRedirect(route('dashboard'));
});
