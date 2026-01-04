<?php

declare(strict_types=1);

namespace App\Services\Quiz;

use App\Contracts\Abstracts\Service\AbstractService;
use App\Contracts\Enums\QuizTypeEnum;
use App\Contracts\Enums\SubmissionProcessEnum;
use App\Contracts\Interfaces\Service\TransactionServiceable;
use App\Models\QuizAnswer\QuizAnswer;
use App\Models\QuizOption\QuizOption;
use App\Models\QuizQuestion\QuizQuestion;
use App\Models\Submission\Quiz\QuizSubmission;

final class GradeQuizSubmissionService extends AbstractService implements TransactionServiceable
{
    public function __construct(
        protected QuizSubmission $submission,
        protected array $answers,
        protected string $spentTime,
    ) {
    }

    public function transaction(): bool
    {
        return true;
    }

    public function handle(): void
    {
        $quizId = $this->submission->quiz_id;

        $questions = QuizQuestion::query()
            ->where('quiz_id', $quizId)
            ->select('id', 'type', 'point')
            ->get()
            ->keyBy('id');

        $correctOptionsMap = QuizOption::query()
            ->whereIn('question_id', $questions->keys())
            ->where('is_correct', true)
            ->get(['id', 'question_id'])
            ->groupBy('question_id')
            ->map(fn ($options) => $options->pluck('id')->toArray());

        $totalScore = 0;
        $answerData = [];

        foreach ($questions as $questionId => $question) {
            $selectedOptionIds = $this->answers[$questionId] ?? [];
            $correctOptionIds = $correctOptionsMap->get($questionId, []);

            $isCorrect = $this->isAnswerCorrect(
                $question->type,
                $selectedOptionIds,
                $correctOptionIds
            );

            if ($isCorrect) {
                $totalScore += $question->point;
            }

            $answerData[] = [
                'submission_id' => $this->submission->id,
                'question_id' => $questionId,
                'options' => empty($selectedOptionIds) ? null : json_encode($selectedOptionIds),
                'is_correct' => $isCorrect,
            ];
        }

        QuizAnswer::query()->upsert(
            $answerData,
            ['submission_id', 'question_id'],
            ['options', 'is_correct']
        );

        $this->submission->update([
            'score' => $totalScore,
            'spent_time' => $this->spentTime,
            'status' => SubmissionProcessEnum::COMPLETED->value,
            'submitted_at' => now(),
        ]);

        $this->setResult(['score' => $totalScore]);
    }

    private function isAnswerCorrect(string $type, array $selectedOptionIds, array $correctOptionIds): bool
    {
        if (empty($selectedOptionIds) || empty($correctOptionIds)) {
            return false;
        }

        if (in_array($type, [QuizTypeEnum::SINGLE_CHOICE->value, QuizTypeEnum::TRUE_FALSE->value])) {
            return count($selectedOptionIds) === 1 && in_array($selectedOptionIds[0], $correctOptionIds);
        }

        if ($type === QuizTypeEnum::MULTIPLE_CHOICE->value) {
            sort($selectedOptionIds);
            sort($correctOptionIds);
            return $selectedOptionIds === $correctOptionIds;
        }

        return false;
    }
}
