<?php

declare(strict_types=1);

namespace App\DTOs\Quiz;

use App\Contracts\Abstracts\DTO\AbstractDataObject;
use App\Contracts\Enums\QuizTypeEnum;

final readonly class QuizQuestionDTO extends AbstractDataObject
{
    public function __construct(
        public ?int $id = null,
        public ?int $quizId = null,
        public QuizTypeEnum $type,
        public string $content,
        public int $order,
        public int $point = 1,
        public array $options = []
    ) {
    }

    public static function make(array $data, ?int $quiz_id = null): self
    {
        $id = $data['id'] ?? null;
        $type = QuizTypeEnum::tryFrom(mb_strtolower($data['type']));
        $point = $data['point'] ?? 1;
        $options = !empty($data['options']) ? array_map(fn ($option) => QuizOptionDTO::make($option), $data['options']) : [];

        return new self($id, $quiz_id, $type, $data['content'], $data['order'], $point, $options);
    }

    public function toArray(): array
    {
        return [
            'quiz_id' => $this->quizId,
            'type' => $this->type->value,
            'content' => $this->content,
            'order' => $this->order,
            'point' => $this->point,
        ];
    }
}
