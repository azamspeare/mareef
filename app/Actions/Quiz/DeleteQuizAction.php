<?php

declare(strict_types=1);

namespace App\Actions\Quiz;

use App\Models\Quiz\Quiz;

final class DeleteQuizAction
{
    public function run(Quiz $quiz): bool
    {
        if ($quiz->trashed()) {
            return $quiz->forceDelete();
        }

        return false;
    }
}
