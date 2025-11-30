<?php

declare(strict_types=1);

namespace App\DTOs\Writing;

use App\Contracts\Abstracts\DTO\AbstractDataObject;
use Carbon\CarbonInterface;
use Illuminate\Support\Str;

final readonly class WritingDTO extends AbstractDataObject
{
    public function __construct(
        public int $teacherId,
        public string $title,
        public string $slug,
        public array $content,
        public ?string $allocatedTime = null,
        public ?CarbonInterface $publicAt = null,
        public string $hash
    ) {
    }

    public static function make(array $data, int $teacher_id): self
    {
        $title = $data['title'];
        $slug = Str::slug($title);
        $content = $data['content'];
        $allocatedTime = $data['allocated_time'] ?? null;
        $publicAt = isset($data['public_at']) && $data['public_at'] ? now() : null;
        $hash = hash('sha256', $title . $teacher_id . now()->toString());

        return new self($teacher_id, $title, $slug, $content, $allocatedTime, $publicAt, $hash);
    }

    public function toArray(): array
    {
        return [
            'teacher_id' => $this->teacherId,
            'title' => $this->title,
            'slug' => $this->slug,
            'content' => $this->content,
            'allocated_time' => $this->allocatedTime,
            'public_at' => $this->publicAt,
            'hash' => $this->hash,
        ];
    }
}
