<?php

declare(strict_types=1);

namespace App\DTOs\Writing;

use App\Contracts\Abstracts\DTO\AbstractDataObject;
use App\Contracts\Enums\SubmissionProcessEnum;
use Carbon\CarbonInterface;

final readonly class WritingSubmissionDTO extends AbstractDataObject
{
    public function __construct(
        public int $writingId,
        public int $studentId,
        public string $content = '',
        public ?string $spentTime = null,
        public string $status,
        public ?CarbonInterface $submittedAt = null,
        public ?CarbonInterface $evaluatedAt = null,
    ) {
    }

    public static function make(array $data, int $studentId): self
    {
        return new self(
            writingId: $data['writing_id'],
            studentId: $studentId,
            content: $data['content'] ?? '',
            spentTime: $data['spent_time'] ?? null,
            status: $data['status'] ?? SubmissionProcessEnum::IN_PROGRESS->value,
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
            'status' => $this->status,
            'submitted_at' => $this->submittedAt,
            'evaluated_at' => $this->evaluatedAt,
        ];
    }
}
