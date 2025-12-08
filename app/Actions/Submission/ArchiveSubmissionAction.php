<?php

declare(strict_types=1);

namespace App\Actions\Submission;

use App\Models\Submission\WritingSubmission;

final class ArchiveSubmissionAction
{
    public function run(WritingSubmission $submission): bool
    {
        return $submission->delete();
    }
}
