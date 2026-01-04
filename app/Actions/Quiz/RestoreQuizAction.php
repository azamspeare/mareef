<?php

declare(strict_types=1);

namespace App\Actions\Quiz;

use App\Models\Quiz\Quiz;

final class RestoreQuizAction
{
    public function run(Quiz $quiz): bool
    {
        return $quiz->restore();
    }
}
