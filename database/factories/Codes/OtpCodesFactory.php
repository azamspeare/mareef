<?php

declare(strict_types=1);

namespace Database\Factories\Codes;

use App\Models\OtpCode\OtpCode;
use App\Models\User\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<OtpCode>
 */
final class OtpCodesFactory extends Factory
{
    protected $model = OtpCode::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'code' => (string) fake()->numberBetween(100000, 999999),
            'expires_at' => now()->addMinutes(5),
        ];
    }

    /**
     * Indicate that the OTP code is expired.
     */
    public function expired(): self
    {
        return $this->state(fn (array $attributes) => [
            'expires_at' => now()->subMinutes(5),
        ]);
    }

    /**
     * Indicate that the OTP code is valid for a specific duration.
     */
    public function validFor(int $minutes): self
    {
        return $this->state(fn (array $attributes) => [
            'expires_at' => now()->addMinutes($minutes),
        ]);
    }

    /**
     * Set a specific code.
     */
    public function withCode(string $code): self
    {
        return $this->state(fn (array $attributes) => [
            'code' => $code,
        ]);
    }
}
