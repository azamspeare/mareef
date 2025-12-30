<?php

declare(strict_types=1);

namespace Database\Factories\Quiz;

use App\Contracts\Enums\QuizTypeEnum;
use App\Models\Quiz\Quiz;
use App\Models\QuizQuestion\QuizQuestion;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<QuizQuestion>
 */
final class QuizQuestionFactory extends Factory
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
            'quiz_id' => Quiz::factory(),
            'type' => fake()->randomElement(QuizTypeEnum::cases())->value,
            'content' => fake()->sentence() . '?',
            'order' => ++self::$orderCounter,
            'point' => fake()->numberBetween(1, 5),
        ];
    }

    /**
     * Reset the order counter for a new quiz.
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
     * Single choice question.
     */
    public function singleChoice(): self
    {
        return $this->state(fn (array $attributes) => [
            'type' => QuizTypeEnum::SINGLE_CHOICE->value,
        ]);
    }

    /**
     * Multiple choice question.
     */
    public function multipleChoice(): self
    {
        return $this->state(fn (array $attributes) => [
            'type' => QuizTypeEnum::MULTIPLE_CHOICE->value,
        ]);
    }

    /**
     * True/False question.
     */
    public function trueFalse(): self
    {
        return $this->state(fn (array $attributes) => [
            'type' => QuizTypeEnum::TRUE_FALSE->value,
        ]);
    }

    /**
     * Short answer question.
     */
    public function shortAnswer(): self
    {
        return $this->state(fn (array $attributes) => [
            'type' => QuizTypeEnum::SHORT_ANSWER->value,
        ]);
    }

    /**
     * Long answer question.
     */
    public function longAnswer(): self
    {
        return $this->state(fn (array $attributes) => [
            'type' => QuizTypeEnum::LONG_ANSWER->value,
        ]);
    }
}
