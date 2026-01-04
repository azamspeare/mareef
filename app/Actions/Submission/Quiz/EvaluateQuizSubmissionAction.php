<?php

declare(strict_types=1);

namespace App\Actions\Submission\Quiz;

use App\DTOs\Quiz\QuizFeedbackDTO;
use App\Models\Submission\Quiz\QuizSubmission;

final class EvaluateQuizSubmissionAction
{
    public function run(QuizSubmission $submission, QuizFeedbackDTO $dto): bool
    {
        return $submission->update($dto->toArray());
    }
}
