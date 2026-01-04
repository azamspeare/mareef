<?php

declare(strict_types=1);

namespace App\Actions\Submission\Quiz;

use App\DTOs\Quiz\QuizSubmissionDTO;
use App\Models\Submission\Quiz\QuizSubmission;

final class CreateQuizSubmissionAction
{
    public function run(QuizSubmissionDTO $dto): QuizSubmission
    {
        return QuizSubmission::query()->create($dto->toArray());
    }
}
