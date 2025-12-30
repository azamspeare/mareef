<?php

declare(strict_types=1);

namespace Database\Factories\Quiz;

use App\Models\QuizAnswer\QuizAnswer;
use App\Models\QuizQuestion\QuizQuestion;
use App\Models\Submission\Quiz\QuizSubmission;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<QuizAnswer>
 */
final class QuizAnswerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'submission_id' => QuizSubmission::factory(),
            'question_id' => QuizQuestion::factory(),
            'options' => [fake()->numberBetween(1, 4)],
            'is_correct' => fake()->boolean(50),
        ];
    }

    /**
     * Mark answer as correct.
     */
    public function correct(): self
    {
        return $this->state(fn (array $attributes) => [
            'is_correct' => true,
        ]);
    }

    /**
     * Mark answer as incorrect.
     */
    public function incorrect(): self
    {
        return $this->state(fn (array $attributes) => [
            'is_correct' => false,
        ]);
    }

    /**
     * Set specific selected options.
     */
    public function withOptions(array $optionIds): self
    {
        return $this->state(fn (array $attributes) => [
            'options' => $optionIds,
        ]);
    }
}
