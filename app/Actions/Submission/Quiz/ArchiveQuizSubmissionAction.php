<?php

declare(strict_types=1);

namespace App\Actions\Submission\Quiz;

use App\Models\Submission\Quiz\QuizSubmission;

final class ArchiveQuizSubmissionAction
{
    public function run(QuizSubmission $submission): bool
    {
        return $submission->delete();
    }
}
