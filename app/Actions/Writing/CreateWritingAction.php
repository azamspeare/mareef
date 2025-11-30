<?php

declare(strict_types=1);

namespace App\Actions\Writing;

use App\DTOs\Writing\WritingDTO;
use App\Models\Writing\Writing;

final class CreateWritingAction
{
    public function run(WritingDTO $dto): Writing
    {
        return Writing::query()->create($dto->toArray());
    }
}
