<?php

declare(strict_types=1);

namespace App\Services\Quiz;

use App\Actions\Quiz\UpdateQuizAction;
use App\Contracts\Abstracts\Service\AbstractService;
use App\Contracts\Interfaces\Service\TransactionServiceable;
use App\DTOs\Quiz\QuizDTO;
use App\DTOs\Quiz\QuizQuestionDTO;
use App\Models\Quiz\Quiz;
use App\Models\QuizOption\QuizOption;
use App\Models\QuizQuestion\QuizQuestion;
use Illuminate\Support\Collection;

final class UpdateQuizService extends AbstractService implements TransactionServiceable
{
    protected UpdateQuizAction $action;

    public function __construct(
        protected Quiz $quiz,
        protected QuizDTO $dto,
        protected Collection $questions
    ) {
        $this->action = new UpdateQuizAction;
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

        $this->action->run($this->quiz, $updatedDto);

        $this->syncQuestions();

        $this->setResult($this->quiz);
    }

    private function syncQuestions(): void
    {
        $now = now();

        // Separate existing vs new questions
        $existingQuestions = [];
        $newQuestions = [];

        /** @var QuizQuestionDTO $dto */
        foreach ($this->questions as $dto) {
            if ($dto->id) {
                $existingQuestions[] = $dto;
            } else {
                $newQuestions[] = $dto;
            }
        }

        $existingIds = array_map(fn ($q) => $q->id, $existingQuestions);

        // 1. Bulk soft delete removed questions
        $this->quiz->questions()
            ->whereNotIn('id', $existingIds)
            ->delete();

        // 2. Bulk upsert existing questions
        if (! empty($existingQuestions)) {
            $upsertData = array_map(fn ($dto) => [
                'id' => $dto->id,
                'quiz_id' => $this->quiz->id,
                'type' => $dto->type->value,
                'content' => $dto->content,
                'order' => $dto->order,
                'point' => $dto->point,
                'updated_at' => $now,
            ], $existingQuestions);

            QuizQuestion::upsert($upsertData, ['id'], ['type', 'content', 'order', 'point', 'updated_at']);
        }

        // 3. Bulk insert new questions
        if (! empty($newQuestions)) {
            $insertData = array_map(fn ($dto) => [
                'quiz_id' => $this->quiz->id,
                'type' => $dto->type->value,
                'content' => $dto->content,
                'order' => $dto->order,
                'point' => $dto->point,
                'created_at' => $now,
                'updated_at' => $now,
            ], $newQuestions);

            QuizQuestion::insert($insertData);
        }

        // 4. Sync all options
        $this->syncOptions($existingQuestions, $newQuestions);
    }

    private function syncOptions(array $existingQuestions, array $newQuestions): void
    {
        $now = now();

        // Get IDs of newly inserted questions by their order
        $newQuestionIds = [];
        if (! empty($newQuestions)) {
            $newOrders = array_map(fn ($q) => $q->order, $newQuestions);
            $newQuestionIds = QuizQuestion::query()
                ->where('quiz_id', $this->quiz->id)
                ->whereIn('order', $newOrders)
                ->whereNull('deleted_at')
                ->pluck('id', 'order')
                ->toArray();
        }

        // Collect all options
        $existingOptions = [];
        $newOptions = [];
        $keepOptionIds = [];

        // Process existing questions' options
        foreach ($existingQuestions as $dto) {
            foreach ($dto->options as $optionDto) {
                if ($optionDto->id) {
                    $existingOptions[] = [
                        'id' => $optionDto->id,
                        'question_id' => $dto->id,
                        'content' => $optionDto->content,
                        'is_correct' => $optionDto->isCorrect,
                        'order' => $optionDto->order,
                        'updated_at' => $now,
                    ];
                    $keepOptionIds[] = $optionDto->id;
                } else {
                    $newOptions[] = [
                        'question_id' => $dto->id,
                        'content' => $optionDto->content,
                        'is_correct' => $optionDto->isCorrect,
                        'order' => $optionDto->order,
                        'created_at' => $now,
                        'updated_at' => $now,
                    ];
                }
            }
        }

        // Process new questions' options
        foreach ($newQuestions as $dto) {
            $questionId = $newQuestionIds[$dto->order] ?? null;
            if (! $questionId) {
                continue;
            }

            foreach ($dto->options as $optionDto) {
                $newOptions[] = [
                    'question_id' => $questionId,
                    'content' => $optionDto->content,
                    'is_correct' => $optionDto->isCorrect,
                    'order' => $optionDto->order,
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }
        }

        // 1. Bulk soft delete removed options (only for existing questions)
        $existingQuestionIds = array_map(fn ($q) => $q->id, $existingQuestions);
        if (! empty($existingQuestionIds)) {
            QuizOption::query()
                ->whereIn('question_id', $existingQuestionIds)
                ->whereNotIn('id', $keepOptionIds)
                ->delete();
        }

        // 2. Bulk upsert existing options
        if (! empty($existingOptions)) {
            QuizOption::upsert($existingOptions, ['id'], ['content', 'is_correct', 'order', 'updated_at']);
        }

        // 3. Bulk insert new options
        if (! empty($newOptions)) {
            QuizOption::insert($newOptions);
        }
    }

    /**
     * Ensure slug is unique for the teacher by appending timestamp if needed.
     * Excludes the current quiz from the uniqueness check.
     */
    private function ensureUniqueSlug(string $baseSlug, int $teacherId): string
    {
        // If the slug hasn't changed, keep it
        if ($baseSlug === $this->quiz->slug) {
            return $baseSlug;
        }

        $slug = $baseSlug;

        while (Quiz::query()
            ->where('teacher_id', $teacherId)
            ->where('slug', $slug)
            ->where('id', '!=', $this->quiz->id)
            ->exists()
        ) {
            $slug = $baseSlug . '-' . now()->timestamp;
        }

        return $slug;
    }
}
