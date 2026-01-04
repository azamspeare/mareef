<?php

declare(strict_types=1);

namespace App\DTOs\Quiz;

use App\Contracts\Abstracts\DTO\AbstractDataObject;
use App\Contracts\Enums\SubmissionProcessEnum;
use Carbon\CarbonInterface;

final readonly class QuizSubmissionDTO extends AbstractDataObject
{
    public function __construct(
        public int $quizId,
        public int $studentId,
        public int $score = 0,
        public ?string $spentTime = null,
        public string $status = 'in_progress',
        public ?CarbonInterface $submittedAt = null,
    ) {
    }

    public static function make(array $data, int $studentId): self
    {
        return new self(
            quizId: $data['quiz_id'],
            studentId: $studentId,
            score: $data['score'] ?? 0,
            spentTime: $data['spent_time'] ?? null,
            status: $data['status'] ?? SubmissionProcessEnum::IN_PROGRESS->value,
            submittedAt: $data['submitted_at'] ?? null,
        );
    }

    public function toArray(): array
    {
        return [
            'quiz_id' => $this->quizId,
            'student_id' => $this->studentId,
            'score' => $this->score,
            'spent_time' => $this->spentTime,
            'status' => $this->status,
            'submitted_at' => $this->submittedAt,
        ];
    }
}
