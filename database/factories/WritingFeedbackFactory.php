<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Feedback\WritingFeedback;
use App\Models\Submission\WritingSubmission;
use App\Models\User\User;
use Database\Factories\Traits\HasEditorJSContent;
use Database\Factories\Traits\HasTipTapContent;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<WritingFeedback>
 */
final class WritingFeedbackFactory extends Factory
{
    use HasTipTapContent, HasEditorJSContent;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'submission_id' => WritingSubmission::factory(),
            'teacher_id' => User::factory(),
            'content' => $this->generateTipTapContent(),
            'score' => fake()->randomFloat(2, 0, 100),
            'feedback' => fake()->paragraphs(3, true),
        ];
    }

    /**
     * Generate content in TipTap (ProseMirror) format.
     */
    protected function generateTipTapContent(): array
    {
        return $this->generateTipTapFeedback();
    }

    /**
     * Generate content in EditorJS format.
     */
    protected function generateEditorJSContent(): array
    {
        return $this->generateEditorJSFeedback();
    }

    /**
     * Indicate that the feedback is excellent (high score).
     */
    public function excellent(): self
    {
        return $this->state(fn (array $attributes) => [
            'score' => fake()->randomFloat(2, 85, 100),
        ]);
    }

    /**
     * Indicate that the feedback is good (medium-high score).
     */
    public function good(): self
    {
        return $this->state(fn (array $attributes) => [
            'score' => fake()->randomFloat(2, 70, 84),
        ]);
    }

    /**
     * Indicate that the feedback is fair (medium score).
     */
    public function fair(): self
    {
        return $this->state(fn (array $attributes) => [
            'score' => fake()->randomFloat(2, 50, 69),
        ]);
    }

    /**
     * Indicate that the feedback is poor (low score).
     */
    public function poor(): self
    {
        return $this->state(fn (array $attributes) => [
            'score' => fake()->randomFloat(2, 0, 49),
        ]);
    }
}
