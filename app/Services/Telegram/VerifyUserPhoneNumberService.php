<?php

namespace App\Services\Telegram;

use App\Contracts\Abstracts\Service\AbstractService;
use App\Contracts\Interfaces\Service\TransactionServiceable;
use App\Models\OtpCode\OtpCode;
use App\Models\Telegram\TelegramUser;
use App\Models\User\User;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use InvalidArgumentException;

final class VerifyUserPhoneNumberService extends AbstractService implements TransactionServiceable
{
    public function __construct(
        protected int $chatId,
        protected string $phoneNumber
    ) {
    }

    public function transaction(): bool
    {
        return true;
    }

    public function handle(): void
    {
        $user = User::query()
            ->where('phone_number', '=', $this->phoneNumber)
            ->first();
        if (! $user) {
            throw new ModelNotFoundException('User not found.');
        }

        $telegramUser = TelegramUser::query()
            ->where('chat_id', '=', $this->chatId)
            ->first();
        if (! $telegramUser) {
            throw new ModelNotFoundException('Telegram user not found.');
        }

        $otpCode = OtpCode::query()
            ->where('user_id', '=', $user->id)
            ->where('expires_at', '>', now())
            ->latest()
            ->first();
        if (! $otpCode) {
            throw new InvalidArgumentException('No active OTP code found for this user.');
        }

        $telegramUser->update([
            'user_id' => $user->id,
            'phone_number' => $this->phoneNumber
        ]);

        $this->setResult([
            'code' => $otpCode->code
        ]);
    }
}
