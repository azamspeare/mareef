<?php

declare(strict_types=1);

namespace App\Services\Writing;

use App\Contracts\Abstracts\Service\AbstractService;
use App\Actions\Writing\UpdateWritingAction;
use App\DTOs\Writing\WritingDTO;
use App\Helpers\Content\BlockNoteContentHelper;
use App\Models\Writing\Writing;

final class UpdateWritingService extends AbstractService
{
    protected UpdateWritingAction $action;

    public function __construct(protected Writing $writing, protected WritingDTO $dto)
    {
        $this->action = new UpdateWritingAction;
    }

    public function handle(): void
    {
        // Only update slug if title changed, otherwise keep existing slug
        $slug = $this->writing->title === $this->dto->title
            ? $this->writing->slug
            : $this->ensureUniqueSlug($this->dto->slug, $this->dto->teacherId);

        // Process BlockNote content (move images from temp to permanent storage)
        $content = BlockNoteContentHelper::processImages($this->dto->content);

        // Create a new DTO with updated slug and content
        $updatedDto = new WritingDTO(
            teacherId: $this->dto->teacherId,
            title: $this->dto->title,
            slug: $slug,
            content: $content,
            allocatedTime: $this->dto->allocatedTime,
            publicAt: $this->dto->publicAt,
            hash: $this->dto->hash
        );

        $writing = $this->action->run($this->writing, $updatedDto);
        $this->setResult($writing);
    }

    /**
     * Ensure slug is unique for the teacher by appending timestamp if needed
     */
    private function ensureUniqueSlug(string $baseSlug, int $teacherId): string
    {
        $slug = $baseSlug;

        // Exclude current writing from uniqueness check
        while (Writing::query()
            ->where('teacher_id', $teacherId)
            ->where('slug', $slug)
            ->where('id', '!=', $this->writing->id)
            ->exists()
        ) {
            $slug = $baseSlug . '-' . now()->timestamp;
        }

        return $slug;
    }
}
