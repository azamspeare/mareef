<?php

namespace App\Services\Register;

use App\Actions\User\CreateUserAction;
use App\Contracts\Abstracts\Service\AbstractService;
use App\Contracts\Interfaces\Service\TransactionServiceable;
use App\DTOs\User\RegisterDTO;
use App\Helpers\Generator\CodeGenerator;
use App\Models\OtpCode\OtpCode;

final class RegisterStudentService extends AbstractService implements TransactionServiceable
{
    protected CreateUserAction $action;

    public function __construct(
        protected RegisterDTO $dto
    ) {
        $this->action = new CreateUserAction;
    }

    public function transaction(): bool
    {
        return true;
    }

    public function handle(): void
    {
        $user = $this->action->run($this->dto);

        OtpCode::query()
            ->where('user_id', '=', $user->id)
            ->delete();

        OtpCode::query()->create([
            'user_id' => $user->id,
            'code' => CodeGenerator::otp(),
            'expires_at' => now()->addMinutes(5),
        ]);

        $this->setResult($user);
    }
}
