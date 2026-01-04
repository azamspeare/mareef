<?php

declare(strict_types=1);

namespace App\Actions\Submission\Writing;

use App\DTOs\Writing\WritingSubmissionDTO;
use App\Models\Submission\Writing\WritingSubmission;

final class CreateWritingSubmissionAction
{
    public function run(WritingSubmissionDTO $dto): WritingSubmission
    {
        return WritingSubmission::query()->create($dto->toArray());
    }
}
