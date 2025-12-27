<?php

declare(strict_types=1);

namespace App\Models\Telegram;

use App\Models\Telegram\Traits\HasRelations;
use App\Models\User\User;
use Carbon\CarbonInterface;
use Database\Factories\User\TelegramUserFactory;
use Illuminate\Database\Eloquent\Attributes\UseFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Attributes:
 * @property-read int $id
 * @property-read int|null $user_id
 * @property-read int $chat_id
 * @property-read string $first_name
 * @property-read string|null $last_name
 * @property-read string|null $username
 * @property-read string|null $phone_number
 * @property-read bool $is_premium
 * @property-read string|null $photo
 * @property-read string|null $birthday
 * @property-read CarbonInterface $created_at
 * @property-read CarbonInterface $updated_at
 *
 * Relationships:
 * @property-read User|null $user
 */
#[UseFactory(TelegramUserFactory::class)]
final class TelegramUser extends Model
{
    use HasFactory, HasRelations;

    protected $fillable = [
        'user_id',
        'chat_id',
        'first_name',
        'last_name',
        'username',
        'phone_number',
        'is_premium',
        'photo',
        'birthday'
    ];

    protected function casts(): array
    {
        return [
            'is_premium' => 'boolean',
        ];
    }
}
