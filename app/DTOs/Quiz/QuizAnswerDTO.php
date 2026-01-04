<?php

declare(strict_types=1);

namespace App\DTOs\Quiz;

use App\Contracts\Abstracts\DTO\AbstractDataObject;
use Illuminate\Support\Collection;

final readonly class QuizAnswerDTO extends AbstractDataObject
{
    public function __construct(
        public int $submissionId,
        public int $questionId,
        public ?array $options,
        public bool $isCorrect = false,
    ) {
    }

    public static function make(int $submissionId, int $questionId, array $optionIds): self
    {
        return new self(
            submissionId: $submissionId,
            questionId: $questionId,
            options: empty($optionIds) ? null : $optionIds,
            isCorrect: false,
        );
    }

    public static function collection(int $submissionId, array $answers): Collection
    {
        return collect($answers)->map(
            fn (array $optionIds, int|string $questionId) => self::make($submissionId, (int) $questionId, $optionIds)
        )->values();
    }

    public function toArray(): array
    {
        return [
            'submission_id' => $this->submissionId,
            'question_id' => $this->questionId,
            'options' => $this->options,
            'is_correct' => $this->isCorrect,
        ];
    }
}
