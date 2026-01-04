<?php

declare(strict_types=1);

namespace App\DTOs\Quiz;

use App\Contracts\Abstracts\DTO\AbstractDataObject;
use Carbon\CarbonInterface;

final readonly class QuizFeedbackDTO extends AbstractDataObject
{
    public function __construct(
        public string $feedback,
        public CarbonInterface $evaluatedAt,
    ) {
    }

    public static function make(array $data): self
    {
        return new self($data['feedback'], $data['evaluated_at'] ?? now());
    }

    public function toArray(): array
    {
        return [
            'feedback' => $this->feedback,
            'evaluated_at' => $this->evaluatedAt,
        ];
    }
}
