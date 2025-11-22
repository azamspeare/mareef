<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\User\User;
use App\Models\Writing\Writing;
use Database\Factories\Traits\HasEditorJSContent;
use Database\Factories\Traits\HasTipTapContent;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Writing>
 */
final class WritingFactory extends Factory
{
    use HasTipTapContent, HasEditorJSContent;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = fake()->sentence(4);

        return [
            'teacher_id' => User::factory(),
            'title' => $title,
            'slug' => Str::slug($title),
            'content' => $this->generateTipTapContent(),
            'allocated_time' => fake()->randomElement(['00:30:00', '00:45:00', '01:00:00', '01:30:00']),
            'public_at' => fake()->optional(0.7)->dateTimeBetween('-1 month', '+1 month'),
        ];
    }

    /**
     * Generate content in TipTap (ProseMirror) format.
     */
    protected function generateTipTapContent(): array
    {
        return $this->generateTipTapInstructions();
    }

    /**
     * Generate content in EditorJS format.
     */
    protected function generateEditorJSContent(): array
    {
        return $this->generateEditorJSInstructions();
    }

    /**
     * Indicate that the writing is published.
     */
    public function published(): self
    {
        return $this->state(fn (array $attributes) => [
            'public_at' => fake()->dateTimeBetween('-1 month', 'now'),
        ]);
    }

    /**
     * Indicate that the writing is scheduled for future publication.
     */
    public function scheduled(): self
    {
        return $this->state(fn (array $attributes) => [
            'public_at' => fake()->dateTimeBetween('now', '+1 month'),
        ]);
    }

    /**
     * Indicate that the writing is a draft (not yet published).
     */
    public function draft(): self
    {
        return $this->state(fn (array $attributes) => [
            'public_at' => null,
        ]);
    }
}
