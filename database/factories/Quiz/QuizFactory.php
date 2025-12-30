<?php

declare(strict_types=1);

namespace Database\Factories\Quiz;

use App\Models\Quiz\Quiz;
use App\Models\User\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Quiz>
 */
final class QuizFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = fake()->sentence(4);
        $createdAt = now();
        $hash = hash('sha256', $title . $createdAt->toDateTimeString());

        return [
            'teacher_id' => User::factory(),
            'title' => $title,
            'slug' => Str::slug($title),
            'description' => fake()->optional(0.8)->paragraph(),
            'allocated_time' => fake()->randomElement(['00:15:00', '00:30:00', '00:45:00', '01:00:00']),
            'public_at' => fake()->optional(0.7)->dateTimeBetween('-1 month', '+1 month'),
            'hash' => $hash,
        ];
    }

    /**
     * Indicate that the quiz is published.
     */
    public function published(): self
    {
        return $this->state(fn (array $attributes) => [
            'public_at' => fake()->dateTimeBetween('-1 month', 'now'),
        ]);
    }

    /**
     * Indicate that the quiz is scheduled for future publication.
     */
    public function scheduled(): self
    {
        return $this->state(fn (array $attributes) => [
            'public_at' => fake()->dateTimeBetween('now', '+1 month'),
        ]);
    }

    /**
     * Indicate that the quiz is a draft (not yet published).
     */
    public function draft(): self
    {
        return $this->state(fn (array $attributes) => [
            'public_at' => null,
        ]);
    }
}
