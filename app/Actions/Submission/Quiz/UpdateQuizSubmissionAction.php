<?php

declare(strict_types=1);

namespace App\Actions\Submission\Quiz;

use App\DTOs\Quiz\QuizSubmissionDTO;
use App\Models\Submission\Quiz\QuizSubmission;

final class UpdateQuizSubmissionAction
{
    public function run(QuizSubmission $submission, QuizSubmissionDTO $dto): bool
    {
        return $submission->update($dto->toArray());
    }
}
