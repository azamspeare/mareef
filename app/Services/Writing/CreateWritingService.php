<?php

declare(strict_types=1);

namespace App\Services\Writing;

use App\Contracts\Abstracts\Service\AbstractService;
use App\Actions\Writing\CreateWritingAction;
use App\DTOs\Writing\WritingDTO;
use App\Helpers\Content\BlockNoteContentHelper;
use App\Models\Writing\Writing;

final class CreateWritingService extends AbstractService
{
    protected CreateWritingAction $action;

    public function __construct(protected WritingDTO $dto)
    {
        $this->action = new CreateWritingAction;
    }

    public function handle(): void
    {
        // Ensure slug is unique for this teacher
        $slug = $this->ensureUniqueSlug($this->dto->slug, $this->dto->teacherId);

        // Process BlockNote content (download and store images locally)
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

        $writing = $this->action->run($updatedDto);
        $this->setResult($writing);
    }

    /**
     * Ensure slug is unique for the teacher by appending timestamp if needed
     */
    private function ensureUniqueSlug(string $baseSlug, int $teacherId): string
    {
        $slug = $baseSlug;

        while (Writing::query()->where('teacher_id', $teacherId)->where('slug', $slug)->exists()) {
            $slug = $baseSlug . '-' . now()->timestamp;
        }

        return $slug;
    }
}
