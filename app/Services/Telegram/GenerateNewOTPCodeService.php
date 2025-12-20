<?php

declare(strict_types=1);

namespace App\Services\Telegram;

use App\Contracts\Abstracts\Service\AbstractService;
use App\Contracts\Interfaces\Service\TransactionServiceable;
use App\Helpers\Generator\CodeGenerator;
use App\Models\OtpCode\OtpCode;
use App\Models\Telegram\TelegramUser;
use Illuminate\Database\Eloquent\ModelNotFoundException;

final class GenerateNewOTPCodeService extends AbstractService implements TransactionServiceable
{
    public function __construct(protected int $chatId)
    {
    }

    public function transaction(): bool
    {
        return true;
    }

    public function handle(): void
    {
        $telegramUser = TelegramUser::query()
            ->where('chat_id', '=', $this->chatId)
            ->whereNotNull('user_id')
            ->first();
        if (! $telegramUser) {
            throw new ModelNotFoundException('Telegram user not found.');
        }

        $otpCode = OtpCode::query()
            ->where('user_id', '=', $telegramUser->user_id)
            ->where('expires_at', '>', now())
            ->latest()
            ->first();
        if (! $otpCode) {
            OtpCode::query()
                ->where('user_id', '=', $telegramUser->user_id)
                ->delete();

            $code = CodeGenerator::otp();

            OtpCode::query()->create([
                'user_id' => $telegramUser->user_id,
                'code' => $code,
                'expires_at' => now()->addMinutes(2),
            ]);

            $this->setResult(['code' => $code]);
            return;
        }

        $this->setResult(['code' => $otpCode->code]);
    }
}
