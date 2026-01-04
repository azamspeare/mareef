<?php

declare(strict_types=1);

namespace App\Actions\Submission\Quiz;

use App\DTOs\Quiz\QuizAnswerDTO;
use App\Models\QuizAnswer\QuizAnswer;
use Illuminate\Support\Collection;

final class SaveQuizAnswersAction
{
    /**
     * @param Collection<int, QuizAnswerDTO> $answers
     */
    public function run(Collection $answers): void
    {
        if ($answers->isEmpty()) {
            return;
        }

        QuizAnswer::query()->upsert(
            $answers->map(fn (QuizAnswerDTO $dto) => $dto->toArray())->toArray(),
            ['submission_id', 'question_id'],
            ['options']
        );
    }
}
