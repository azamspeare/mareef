<?php

declare(strict_types=1);

namespace App\Models\Writing;

use App\Models\Submission\WritingSubmission;
use App\Models\User\User;
use App\Models\Writing\Traits\HasRelations;
use Carbon\CarbonInterface;
use Database\Factories\Tasks\Writing\WritingFactory;
use Illuminate\Database\Eloquent\Attributes\UseFactory;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Attributes:
 * @property-read int $id
 * @property-read int $teacher_id
 * @property-read string $title
 * @property-read string $slug
 * @property-read array $content
 * @property-read string $allocated_time
 * @property-read CarbonInterface|null $public_at
 * @property-read string $hash
 * @property-read CarbonInterface $created_at
 * @property-read CarbonInterface $updated_at
 * @property-read CarbonInterface|null $deleted_at
 *
 * Relationships:
 * @property-read User $teacher
 * @property-read Collection<WritingSubmission> $submissions
 */
#[UseFactory(WritingFactory::class)]
final class Writing extends Model
{
    use HasFactory, SoftDeletes;
    use HasRelations;

    protected $fillable = [
        'teacher_id',
        'title',
        'slug',
        'content',
        'allocated_time',
        'public_at',
        'hash'
    ];

    protected function casts(): array
    {
        return [
            'content' => 'array',
            'public_at' => 'datetime',
        ];
    }

    /**
     * Transform content to convert storage paths to URLs
     */
    protected function content(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => $this->transformContentImagePaths(
                is_string($value) ? json_decode($value, true) : $value,
                'toUrl'
            ),
            set: fn ($value) => json_encode($value)
        );
    }

    /**
     * Transform image paths in content between storage paths and URLs
     */
    private function transformContentImagePaths(?array $content, string $direction): array
    {
        if (empty($content)) {
            return [];
        }

        foreach ($content as $index => $block) {
            if (!is_array($block)) {
                continue;
            }

            // Transform image blocks
            if (isset($block['type']) && $block['type'] === 'image' && isset($block['props']['url'])) {
                $url = $block['props']['url'];

                if ($direction === 'toUrl') {
                    // Convert storage path to URL
                    if (!str_starts_with($url, 'http://') && !str_starts_with($url, 'https://')) {
                        $filename = basename($url);
                        $content[$index]['props']['url'] = route('images.show', ['filename' => $filename]);
                    }
                }
            }

            // Recursively process children blocks
            if (isset($block['children']) && is_array($block['children']) && !empty($block['children'])) {
                $content[$index]['children'] = $this->transformContentImagePaths($block['children'], $direction);
            }
        }

        return $content;
    }
}
