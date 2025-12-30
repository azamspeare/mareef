<?php

declare(strict_types=1);

namespace Database\Factories\Quiz;

use App\Contracts\Enums\SubmissionProcessEnum;
use App\Models\Quiz\Quiz;
use App\Models\Submission\Quiz\QuizSubmission;
use App\Models\User\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<QuizSubmission>
 */
final class QuizSubmissionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $status = fake()->randomElement([
            SubmissionProcessEnum::IN_PROGRESS->value,
            SubmissionProcessEnum::COMPLETED->value,
        ]);

        $isCompleted = $status === SubmissionProcessEnum::COMPLETED->value;

        return [
            'quiz_id' => Quiz::factory(),
            'student_id' => User::factory(),
            'score' => $isCompleted ? fake()->numberBetween(0, 100) : null,
            'spent_time' => $isCompleted ? fake()->randomElement(['00:10:00', '00:15:00', '00:20:00', '00:30:00', '00:45:00']) : null,
            'submitted_at' => $isCompleted ? fake()->dateTimeBetween('-2 months', 'now') : null,
            'status' => $status,
        ];
    }

    /**
     * Indicate that the submission is in progress.
     */
    public function inProgress(): self
    {
        return $this->state(fn (array $attributes) => [
            'score' => null,
            'spent_time' => null,
            'submitted_at' => null,
            'status' => SubmissionProcessEnum::IN_PROGRESS->value,
        ]);
    }

    /**
     * Indicate that the submission is completed.
     */
    public function completed(): self
    {
        return $this->state(fn (array $attributes) => [
            'score' => fake()->numberBetween(0, 100),
            'spent_time' => fake()->randomElement(['00:10:00', '00:15:00', '00:20:00', '00:30:00', '00:45:00']),
            'submitted_at' => fake()->dateTimeBetween('-2 months', 'now'),
            'status' => SubmissionProcessEnum::COMPLETED->value,
        ]);
    }

    /**
     * Indicate that the submission has failed.
     */
    public function failed(): self
    {
        return $this->state(fn (array $attributes) => [
            'score' => null,
            'spent_time' => null,
            'submitted_at' => null,
            'status' => SubmissionProcessEnum::FAILED->value,
        ]);
    }

    /**
     * Set a high score (excellent performance).
     */
    public function excellent(): self
    {
        return $this->completed()->state(fn (array $attributes) => [
            'score' => fake()->numberBetween(85, 100),
        ]);
    }

    /**
     * Set a good score.
     */
    public function good(): self
    {
        return $this->completed()->state(fn (array $attributes) => [
            'score' => fake()->numberBetween(70, 84),
        ]);
    }

    /**
     * Set a fair score.
     */
    public function fair(): self
    {
        return $this->completed()->state(fn (array $attributes) => [
            'score' => fake()->numberBetween(50, 69),
        ]);
    }

    /**
     * Set a poor score.
     */
    public function poor(): self
    {
        return $this->completed()->state(fn (array $attributes) => [
            'score' => fake()->numberBetween(0, 49),
        ]);
    }
}
