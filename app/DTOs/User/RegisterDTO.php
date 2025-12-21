<?php

namespace App\DTOs\User;

use App\Contracts\Abstracts\DTO\AbstractDataObject;
use App\Contracts\Enums\RoleEnum;
use Illuminate\Support\Str;
use SensitiveParameter;

final readonly class RegisterDTO extends AbstractDataObject
{
    public function __construct(
        public string $name,
        public string $email,
        public string $username,
        public string $phoneNumber,
        #[SensitiveParameter] public string $password,
        public RoleEnum $role,
    ) {
    }

    public static function make(array $data, RoleEnum $role): self
    {
        $name = $data['name'];
        $email = mb_strtolower($data['email']);
        $username = Str::before($email, '@');
        $phoneNumber = $data['phone_number'];
        $password = $data['password'];

        return new self($name, $email, $username, $phoneNumber, $password, $role);
    }

    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'email' => $this->email,
            'username' => $this->username,
            'phone_number' => $this->phoneNumber,
            'password' => $this->password,
            'role' => $this->role->value,
        ];
    }
}
