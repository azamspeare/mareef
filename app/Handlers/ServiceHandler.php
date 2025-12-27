<?php

declare(strict_types=1);

namespace App\Handlers;

use App\Contracts\Abstracts\Service\AbstractService;
use App\Contracts\Interfaces\Service\TransactionServiceable;
use Illuminate\Support\Facades\DB;
use Throwable;

final class ServiceHandler
{
    private ?string $error;

    public function getError(string $default): ?string
    {
        if (! $this->error) {
            return $default;
        }

        return $this->error;
    }

    public function handle(AbstractService $childService): array|false
    {
        try {
            if ($childService instanceof TransactionServiceable && $childService->transaction()) {
                DB::transaction(function () use ($childService) {
                    $childService->handle();
                });
            } else {
                $childService->handle();
            }

            return [
                'success' => true,
                'data' => $childService->getResult()
            ];
        } catch (Throwable $throwable) {
            $this->error = $throwable->getMessage();
            logger()->error($throwable->getMessage());

            return false;
        }
    }
}
