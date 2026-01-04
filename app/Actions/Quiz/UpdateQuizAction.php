<?php

declare(strict_types=1);

namespace App\Actions\Quiz;

use App\DTOs\Quiz\QuizDTO;
use App\Models\Quiz\Quiz;

final class UpdateQuizAction
{
    public function run(Quiz $quiz, QuizDTO $dto): bool
    {
        return $quiz->update($dto->toArray());
    }
}
