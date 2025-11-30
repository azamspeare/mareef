<?php

declare(strict_types=1);

namespace App\Actions\Writing;

use App\Models\Writing\Writing;

final class RestoreWritingAction
{
    public function run(Writing $writing): bool
    {
        return $writing->restore();
    }
}
