<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Submission\WritingSubmission;
use App\Models\User\User;
use App\Models\Writing\Writing;
use Database\Factories\Traits\HasBlockNoteContent;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<WritingSubmission>
 */
final class WritingSubmissionFactory extends Factory
{
    use HasBlockNoteContent;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $submittedAt = fake()->dateTimeBetween('-2 months', 'now');

        return [
            'writing_id' => Writing::factory(),
            'student_id' => User::factory(),
            'content' => $this->generateBlockNoteEssay(),
            'spent_time' => fake()->randomElement(['00:15:00', '00:30:00', '00:45:00', '01:00:00', '01:15:00']),
            'submitted_at' => $submittedAt,
            'evaluated_at' => fake()->optional(0.6)->dateTimeBetween($submittedAt, 'now'),
        ];
    }

    /**
     * Indicate that the submission has been evaluated.
     */
    public function evaluated(): self
    {
        return $this->state(function (array $attributes) {
            $submittedAt = $attributes['submitted_at'] ?? now();

            return [
                'evaluated_at' => fake()->dateTimeBetween($submittedAt, 'now'),
            ];
        });
    }

    /**
     * Indicate that the submission is pending evaluation.
     */
    public function pending(): self
    {
        return $this->state(fn (array $attributes) => [
            'evaluated_at' => null,
        ]);
    }
}
