<?php

declare(strict_types=1);

namespace Database\Factories\Quiz;

use App\Models\QuizOption\QuizOption;
use App\Models\QuizQuestion\QuizQuestion;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<QuizOption>
 */
final class QuizOptionFactory extends Factory
{
    private static int $orderCounter = 0;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'question_id' => QuizQuestion::factory(),
            'content' => fake()->sentence(),
            'is_correct' => false,
            'order' => ++self::$orderCounter,
        ];
    }

    /**
     * Reset the order counter for a new question.
     */
    public function resetOrder(): self
    {
        self::$orderCounter = 0;

        return $this;
    }

    /**
     * Set specific order.
     */
    public function order(int $order): self
    {
        return $this->state(fn (array $attributes) => [
            'order' => $order,
        ]);
    }

    /**
     * Mark option as correct.
     */
    public function correct(): self
    {
        return $this->state(fn (array $attributes) => [
            'is_correct' => true,
        ]);
    }

    /**
     * Mark option as incorrect.
     */
    public function incorrect(): self
    {
        return $this->state(fn (array $attributes) => [
            'is_correct' => false,
        ]);
    }
}
