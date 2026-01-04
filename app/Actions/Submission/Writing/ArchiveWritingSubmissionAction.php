<?php

declare(strict_types=1);

namespace App\Actions\Submission\Writing;

use App\Models\Submission\Writing\WritingSubmission;

final class ArchiveWritingSubmissionAction
{
    public function run(WritingSubmission $submission): bool
    {
        return $submission->delete();
    }
}
