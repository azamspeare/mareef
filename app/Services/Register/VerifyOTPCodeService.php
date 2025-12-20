<?php

declare(strict_types=1);

namespace App\Services\Register;

use App\Contracts\Abstracts\Service\AbstractService;
use App\Contracts\Interfaces\Service\TransactionServiceable;
use App\DTOs\User\OTPCodeDTO;
use App\Models\OtpCode\OtpCode;
use App\Models\User\User;
use Illuminate\Database\Eloquent\ModelNotFoundException;

final class VerifyOTPCodeService extends AbstractService implements TransactionServiceable
{
    public function __construct(
        protected User $user,
        protected OTPCodeDTO $dto
    ) {
    }

    public function transaction(): bool
    {
        return true;
    }

    public function handle(): void
    {
        $otpCode = OtpCode::query()
            ->where('user_id', '=', $this->user->id)
            ->where('code', '=', $this->dto->otpCode)
            ->where('expires_at', '>', now())
            ->first();

        if (! $otpCode) {
            throw new ModelNotFoundException('Invalid OTP code.');
        }

        $this->user->update(['email_verified_at' => now()]);

        $otpCode->delete();

        $this->setResult(true);
    }
}
