<?php

declare(strict_types=1);

namespace App\Actions\Submission\Writing;

use App\DTOs\Writing\WritingSubmissionDTO;
use App\Models\Submission\Writing\WritingSubmission;

final class UpdateWritingSubmissionAction
{
    public function run(WritingSubmission $submission, WritingSubmissionDTO $dto): bool
    {
        return $submission->update($dto->toArray());
    }
}
