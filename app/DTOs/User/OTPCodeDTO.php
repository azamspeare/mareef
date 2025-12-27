<?php

namespace App\DTOs\User;

use App\Contracts\Abstracts\DTO\AbstractDataObject;

final readonly class OTPCodeDTO extends AbstractDataObject
{
    public function __construct(
        public int $otpCode
    ) {
    }

    public static function make(string $code): self
    {
        return new self($code);
    }

    public function toArray(): array
    {
        return [
            'otp_code' => $this->otpCode,
        ];
    }
}
