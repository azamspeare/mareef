<?php

declare(strict_types=1);

namespace App\Actions\Quiz;

use App\DTOs\Quiz\QuizDTO;
use App\Models\Quiz\Quiz;

final class CreateQuizAction
{
    public function run(QuizDTO $dto): Quiz
    {
        return Quiz::query()->create($dto->toArray());
    }
}
