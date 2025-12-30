<?php

declare(strict_types=1);

namespace App\Actions\Submission;

use App\DTOs\Submission\SubmissionDTO;
use App\Models\Submission\Writing\WritingSubmission;

final class UpdateSubmissionAction
{
    public function run(WritingSubmission $submission, SubmissionDTO $dto): bool
    {
        return $submission->update($dto->toArray());
    }
}
