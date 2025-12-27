<?php

declare(strict_types=1);

namespace Database\Factories\User;

use App\Models\User\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends Factory<User>
 */
final class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $email = fake()->unique()->safeEmail();
        $username = Str::before($email, '@');

        return [
            'name' => fake()->name(),
            'email' => $email,
            'username' => $username,
            'phone_number' => $this->generateUzbekPhoneNumber(),
            'email_verified_at' => now(),
            'password' => self::$password ??= Hash::make('password'),
            'role' => fake()->randomElement(['admin', 'teacher', 'student']),
            'avatar' => null,
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * Generate a fake Uzbekistan phone number.
     */
    private function generateUzbekPhoneNumber(): string
    {
        $prefixes = ['90', '91', '93', '94', '95', '97', '98', '99', '33', '88'];
        $prefix = fake()->randomElement($prefixes);
        $number = fake()->numerify('#######');

        return '+998' . $prefix . $number;
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): self
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    /**
     * Indicate that the user has no phone number.
     */
    public function withoutPhone(): self
    {
        return $this->state(fn (array $attributes) => [
            'phone_number' => null,
        ]);
    }

    /**
     * Indicate that the user is an admin.
     */
    public function admin(): self
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'admin',
        ]);
    }

    /**
     * Indicate that the user is a teacher.
     */
    public function teacher(): self
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'teacher',
        ]);
    }

    /**
     * Indicate that the user is a student.
     */
    public function student(): self
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'student',
        ]);
    }
}
