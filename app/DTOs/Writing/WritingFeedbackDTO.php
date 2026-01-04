<?php

declare(strict_types=1);

namespace App\DTOs\Writing;

use App\Contracts\Abstracts\DTO\AbstractDataObject;

final readonly class WritingFeedbackDTO extends AbstractDataObject
{
    public function __construct(
        public int $submissionId,
        public int $teacherId,
        public string $content,
        public ?float $score = null,
        public ?string $feedback = null,
    ) {
    }

    public static function make(array $data, int $teacherId): self
    {
        return new self(
            submissionId: $data['submission_id'],
            teacherId: $teacherId,
            content: $data['content'],
            score: isset($data['score']) ? (float) $data['score'] : null,
            feedback: $data['feedback'] ?? null,
        );
    }

    public function toArray(): array
    {
        return [
            'submission_id' => $this->submissionId,
            'teacher_id' => $this->teacherId,
            'content' => $this->content,
            'score' => $this->score,
            'feedback' => $this->feedback,
        ];
    }
}
