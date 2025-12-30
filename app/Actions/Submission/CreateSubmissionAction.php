<?php

declare(strict_types=1);

namespace App\Actions\Submission;

use App\DTOs\Submission\SubmissionDTO;
use App\Models\Submission\Writing\WritingSubmission;

final class CreateSubmissionAction
{
    public function run(SubmissionDTO $dto): WritingSubmission
    {
        return WritingSubmission::query()->create($dto->toArray());
    }
}
