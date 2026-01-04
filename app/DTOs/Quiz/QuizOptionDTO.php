<?php

declare(strict_types=1);

namespace App\DTOs\Quiz;

use App\Contracts\Abstracts\DTO\AbstractDataObject;

final readonly class QuizOptionDTO extends AbstractDataObject
{
    public function __construct(
        public ?int $id = null,
        public ?int $questionId = null,
        public string $content,
        public bool $isCorrect,
        public int $order
    ) {
    }

    public static function make(array $data, ?int $question_id = null): self
    {
        $id = $data['id'] ?? null;

        return new self($id, $question_id, $data['content'], $data['is_correct'], $data['order']);
    }

    public function toArray(): array
    {
        return [
            'question_id' => $this->questionId,
            'content' => $this->content,
            'is_correct' => $this->isCorrect,
            'order' => $this->order,
        ];
    }
}
