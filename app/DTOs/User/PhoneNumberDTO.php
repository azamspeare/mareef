<?php

namespace App\DTOs\User;

use App\Contracts\Abstracts\DTO\AbstractDataObject;
use App\Helpers\Generators\CodeGenerator;

final readonly class PhoneNumberDTO extends AbstractDataObject
{
    public function __construct(
        public string $phoneNumber,
        public int $otpCode
    ) {
    }

    public static function make(string $phoneNumber): self
    {
        return new self($phoneNumber, CodeGenerator::otp());
    }

    public function toArray(): array
    {
        return [
            'phone_number' => $this->phoneNumber,
            'otp_code' => $this->otpCode,
        ];
    }
}
