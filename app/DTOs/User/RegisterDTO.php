<?php

declare(strict_types=1);

namespace App\DTOs\User;

use App\Contracts\Abstracts\DTO\AbstractDataObject;
use App\Contracts\Enums\RoleEnum;
use Illuminate\Support\Str;
use Laravel\Socialite\Two\User;

final readonly class RegisterDTO extends AbstractDataObject
{
    public function __construct(
        public string $name,
        public string $email,
        public string $username,
        public ?string $password,
        public RoleEnum $role,
        public ?string $avatar = null
    ) {
    }

    public static function make(User $user, RoleEnum $role): self
    {
        $name = $user->getName();
        $email = mb_strtolower($user->getEmail());
        $username = Str::before($email, '@');
        $password = null;
        $avatar = $user->getAvatar();

        return new self($name, $email, $username, $password, $role, $avatar);
    }

    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'email' => $this->email,
            'username' => $this->username,
            'email_verified_at' => now(),
            'password' => $this->password,
            'role' => $this->role->value,
            'avatar' => $this->avatar,
        ];
    }
}
