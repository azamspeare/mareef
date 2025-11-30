<?php

declare(strict_types=1);

namespace App\Actions\Writing;

use App\Models\Writing\Writing;

final class ArchiveWritingAction
{
    public function run(Writing $writing): bool
    {
        return $writing->delete();
    }
}
