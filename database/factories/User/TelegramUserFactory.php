<?php

declare(strict_types=1);

namespace Database\Factories\User;

use App\Models\Telegram\TelegramUser;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<TelegramUser>
 */
final class TelegramUserFactory extends Factory
{
    protected $model = TelegramUser::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => null,
            'chat_id' => fake()->unique()->numberBetween(100000000, 9999999999),
            'first_name' => fake()->firstName(),
            'last_name' => fake()->optional(0.8)->lastName(),
            'username' => fake()->optional(0.7)->userName(),
            'is_premium' => fake()->boolean(20),
            'photo' => null,
            'birthday' => fake()->optional(0.3)->date('Y-m-d'),
        ];
    }

    /**
     * Indicate that the telegram user is linked to a user.
     */
    public function linked(int $userId): self
    {
        return $this->state(fn (array $attributes) => [
            'user_id' => $userId,
        ]);
    }

    /**
     * Indicate that the telegram user is premium.
     */
    public function premium(): self
    {
        return $this->state(fn (array $attributes) => [
            'is_premium' => true,
        ]);
    }

    /**
     * Indicate that the telegram user is not linked to any user.
     */
    public function unlinked(): self
    {
        return $this->state(fn (array $attributes) => [
            'user_id' => null,
        ]);
    }
}
