<?php

declare(strict_types=1);

namespace App\DTOs\User;

use App\Contracts\Abstracts\DTO\AbstractDataObject;

final readonly class TelegramDTO extends AbstractDataObject
{
    public function __construct(
        public ?int $userId = null,
        public int $chatId,
        public string $firstName,
        public ?string $lastName = null,
        public ?string $username = null,
        public bool $isPremium = false,
        public ?string $photo = null,
        public ?string $birthday = null
    ) {
    }

    public static function make(array $data): self
    {
        $user_id = $data['user_id'] ?? null;
        $chat_id = $data['chat_id'];
        $first_name = $data['first_name'];
        $last_name = $data['last_name'] ?? null;
        $username = $data['username'] ?? null;
        $is_premium = $data['is_premium'] ?? false;
        $photo = $data['photo'] ?? null;
        $birthday = $data['birthday'] ?? null;

        return new self($user_id, $chat_id, $first_name, $last_name, $username, $is_premium, $photo, $birthday);
    }

    public function toArray(): array
    {
        return [
            'user_id' => $this->userId,
            'chat_id' => $this->chatId,
            'first_name' => $this->firstName,
            'last_name' => $this->lastName,
            'username' => $this->username,
            'is_premium' => $this->isPremium,
            'photo' => $this->photo,
            'birthday' => $this->birthday,
        ];
    }
}
