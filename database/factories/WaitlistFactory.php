<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Waitlist\Waitlist;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Waitlist>
 */
final class WaitlistFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'email' => fake()->unique()->safeEmail(),
        ];
    }
}
