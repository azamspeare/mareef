<?php

declare(strict_types=1);

namespace App\Services\Quiz;

use App\Actions\Quiz\CreateQuizAction;
use App\Contracts\Abstracts\Service\AbstractService;
use App\Contracts\Interfaces\Service\TransactionServiceable;
use App\DTOs\Quiz\QuizDTO;
use App\DTOs\Quiz\QuizQuestionDTO;
use App\Models\Quiz\Quiz;
use App\Models\QuizOption\QuizOption;
use App\Models\QuizQuestion\QuizQuestion;
use Illuminate\Support\Collection;

final class CreateQuizService extends AbstractService implements TransactionServiceable
{
    protected CreateQuizAction $action;

    public function __construct(
        protected QuizDTO $dto,
        protected Collection $questions
    ) {
        $this->action = new CreateQuizAction;
    }

    public function transaction(): bool
    {
        return true;
    }

    public function handle(): void
    {
        $slug = $this->ensureUniqueSlug($this->dto->slug, $this->dto->teacherId);

        $updatedDto = new QuizDTO(
            teacherId: $this->dto->teacherId,
            title: $this->dto->title,
            slug: $slug,
            description: $this->dto->description,
            allocatedTime: $this->dto->allocatedTime,
            publicAt: $this->dto->publicAt,
            hash: $this->dto->hash
        );

        $quiz = $this->action->run($updatedDto);

        $this->createQuestions($quiz);

        $this->setResult($quiz);
    }

    private function createQuestions(Quiz $quiz): void
    {
        $now = now();
        $questionsData = [];

        /** @var QuizQuestionDTO $questionDTO */
        foreach ($this->questions as $questionDTO) {
            $questionsData[] = [
                'quiz_id' => $quiz->id,
                'type' => $questionDTO->type->value,
                'content' => $questionDTO->content,
                'order' => $questionDTO->order,
                'point' => $questionDTO->point,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        QuizQuestion::query()->insert($questionsData);

        $questionIds = QuizQuestion::query()
            ->where('quiz_id', $quiz->id)
            ->orderBy('order')
            ->pluck('id');

        $this->createOptions($questionIds);
    }

    private function createOptions(Collection $questionIds): void
    {
        $now = now();
        $optionsData = [];

        /** @var QuizQuestionDTO $questionDTO */
        foreach ($this->questions->sortBy('order')->values() as $index => $questionDTO) {
            $questionId = $questionIds[$index];

            foreach ($questionDTO->options as $optionDTO) {
                $optionsData[] = [
                    'question_id' => $questionId,
                    'content' => $optionDTO->content,
                    'is_correct' => $optionDTO->isCorrect,
                    'order' => $optionDTO->order,
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }
        }

        if (!empty($optionsData)) {
            QuizOption::query()->insert($optionsData);
        }
    }

    /**
     * Ensure slug is unique for the teacher by appending timestamp if needed
     */
    private function ensureUniqueSlug(string $baseSlug, int $teacherId): string
    {
        $slug = $baseSlug;

        while (Quiz::query()->where('teacher_id', $teacherId)->where('slug', $slug)->exists()) {
            $slug = $baseSlug . '-' . now()->timestamp;
        }

        return $slug;
    }
}
