<?php

declare(strict_types=1);

namespace App\DTOs\Submission;

use App\Contracts\Abstracts\DTO\AbstractDataObject;
use Carbon\CarbonInterface;

final readonly class SubmissionDTO extends AbstractDataObject
{
    public function __construct(
        public int $writingId,
        public int $studentId,
        public array $content = [],
        public ?string $spentTime = null,
        public ?CarbonInterface $submittedAt = null,
        public ?CarbonInterface $evaluatedAt = null,
    ) {
    }

    public static function make(array $data, int $studentId): self
    {
        return new self(
            writingId: $data['writing_id'],
            studentId: $studentId,
            content: $data['content'] ?? [],
            spentTime: $data['spent_time'] ?? null,
            submittedAt: $data['submitted_at'] ?? null,
            evaluatedAt: $data['evaluated_at'] ?? null,
        );
    }

    public function toArray(): array
    {
        return [
            'writing_id' => $this->writingId,
            'student_id' => $this->studentId,
            'content' => $this->content,
            'spent_time' => $this->spentTime,
            'submitted_at' => $this->submittedAt,
            'evaluated_at' => $this->evaluatedAt,
        ];
    }
}
