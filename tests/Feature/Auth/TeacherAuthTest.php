<?php

declare(strict_types=1);

use App\Contracts\Enums\RoleEnum;
use App\Models\User\User;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\User as SocialiteUser;

beforeEach(function () {
    // Mock Socialite
    $this->socialiteUser = mock(SocialiteUser::class);
    $this->socialiteUser->shouldReceive('getName')->andReturn('John Doe');
    $this->socialiteUser->shouldReceive('getEmail')->andReturn('john@example.com');
    $this->socialiteUser->shouldReceive('getAvatar')->andReturn('https://example.com/avatar.jpg');
});

test('teacher can access Google OAuth redirect', function () {
    $response = $this->get(route('google.redirect'));

    expect($response->status())->toBe(302);
});

test('new teacher can register via Google OAuth callback', function () {
    $provider = mock('Laravel\Socialite\Two\GoogleProvider');
    $provider->shouldReceive('user')->andReturn($this->socialiteUser);

    Socialite::shouldReceive('buildProvider')
        ->andReturn($provider);

    expect(User::where('email', 'john@example.com')->exists())->toBeFalse();

    $response = $this->get(route('google.callback'));

    expect(User::where('email', 'john@example.com')->exists())->toBeTrue();

    $user = User::where('email', 'john@example.com')->first();
    expect($user->name)->toBe('John Doe')
        ->and($user->role)->toBe(RoleEnum::TEACHER->value)
        ->and($user->username)->toBe('john')
        ->and($user->last_login_at)->not->toBeNull()
        ->and(Auth::check())->toBeTrue()
        ->and($response->status())->toBe(302);

    $response->assertRedirect(route('dashboard'));
});

test('existing teacher can login via Google OAuth callback', function () {
    $existingUser = User::factory()->teacher()->create([
        'email' => 'john@example.com',
        'username' => 'john',
        'last_login_at' => now()->subDays(2),
    ]);

    $provider = mock('Laravel\Socialite\Two\GoogleProvider');
    $provider->shouldReceive('user')->andReturn($this->socialiteUser);

    Socialite::shouldReceive('buildProvider')
        ->andReturn($provider);

    $response = $this->get(route('google.callback'));

    $existingUser->refresh();

    expect(Auth::check())->toBeTrue()
        ->and(Auth::id())->toBe($existingUser->id)
        ->and($existingUser->last_login_at->isToday())->toBeTrue()
        ->and($response->status())->toBe(302);

    $response->assertRedirect(route('dashboard'));
});

test('non-teacher user cannot login via teacher OAuth callback', function () {
    User::factory()->student()->create([
        'email' => 'john@example.com',
        'username' => 'john',
    ]);

    $provider = mock('Laravel\Socialite\Two\GoogleProvider');
    $provider->shouldReceive('user')->andReturn($this->socialiteUser);

    Socialite::shouldReceive('buildProvider')
        ->andReturn($provider);

    $response = $this->get(route('google.callback'));

    expect(Auth::check())->toBeFalse()
        ->and($response->status())->toBe(302);

    $response->assertRedirect(route('login'))
        ->assertSessionHas('error');
});

test('OAuth callback handles errors gracefully', function () {
    $provider = mock('Laravel\Socialite\Two\GoogleProvider');
    $provider->shouldReceive('user')->andThrow(new Exception('OAuth error'));

    Socialite::shouldReceive('buildProvider')
        ->andReturn($provider);

    $response = $this->get(route('google.callback'));

    expect(Auth::check())->toBeFalse()
        ->and($response->status())->toBe(302);

    $response->assertRedirect(route('login'))
        ->assertSessionHas('error');
});
