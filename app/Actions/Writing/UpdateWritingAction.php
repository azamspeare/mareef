<?php

declare(strict_types=1);

namespace App\Actions\Writing;

use App\DTOs\Writing\WritingDTO;
use App\Models\Writing\Writing;

final class UpdateWritingAction
{
    public function run(Writing $writing, WritingDTO $dto): bool
    {
        return $writing->update($dto->toArray());
    }
}
