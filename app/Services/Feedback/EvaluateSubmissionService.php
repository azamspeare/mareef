<?php

namespace App\Services\Feedback;

use App\Contracts\Abstracts\Service\AbstractService;
use App\Contracts\Enums\SubmissionStatusEnum;
use App\Contracts\Interfaces\Service\TransactionServiceable;
use App\DTOs\Feedback\FeedbackDTO;
use App\Models\Feedback\WritingFeedback;
use App\Models\Submission\WritingSubmission;

final class EvaluateSubmissionService extends AbstractService implements TransactionServiceable
{
    public function __construct(
        protected FeedbackDTO $dto,
        protected WritingSubmission $submission
    ) {
    }

    public function transaction(): bool
    {
        return true;
    }

    public function handle(): void
    {
        WritingFeedback::query()
            ->updateOrCreate([
                    'submission_id' => $this->submission->id,
                    'teacher_id' => $this->dto->teacherId
                ],
                $this->dto->toArray()
            );

        $this->submission->update([
            'evaluated_at' => now(),
        ]);

        $this->setResult(true);
    }
}
