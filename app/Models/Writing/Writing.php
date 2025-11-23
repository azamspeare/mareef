<?php

declare(strict_types=1);

namespace App\Models\Writing;

use App\Models\Submission\WritingSubmission;
use App\Models\User\User;
use App\Models\Writing\Traits\HasRelations;
use Carbon\CarbonInterface;
use Database\Factories\WritingFactory;
use Illuminate\Database\Eloquent\Attributes\UseFactory;
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
}
