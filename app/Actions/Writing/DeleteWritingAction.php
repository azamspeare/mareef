<?php

declare(strict_types=1);

namespace App\Actions\Writing;

use App\Models\Writing\Writing;

final class DeleteWritingAction
{
    public function run(Writing $writing): bool
    {
        if ($writing->trashed()) {
            return $writing->forceDelete();
        }

        return false;
    }
}
