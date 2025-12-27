<?php

declare(strict_types=1);

namespace App\Services\Register;

use App\Contracts\Abstracts\Service\AbstractService;
use App\Contracts\Interfaces\Service\TransactionServiceable;
use App\DTOs\User\PhoneNumberDTO;
use App\Models\OtpCode\OtpCode;
use App\Models\User\User;

final class RegisterPhoneNumberService extends AbstractService implements TransactionServiceable
{
    public function __construct(
        protected User $user,
        protected PhoneNumberDTO $dto
    ) {
        //
    }

    public function transaction(): bool
    {
        return true;
    }

    public function handle(): void
    {
        $this->user->update(['phone_number' => $this->dto->phoneNumber]);

        OtpCode::query()
            ->where('user_id', '=', $this->user->id)
            ->delete();

        OtpCode::query()->create([
            'user_id' => $this->user->id,
            'code' => $this->dto->otpCode,
            'expires_at' => now()->addMinutes(5),
        ]);

        $this->setResult(true);
    }
}
