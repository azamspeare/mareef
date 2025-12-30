<?php

declare(strict_types=1);

namespace App\Models\Quiz;

use App\Models\Quiz\Traits\HasRelations;
use App\Models\QuizQuestion\QuizQuestion;
use App\Models\Submission\Quiz\QuizSubmission;
use App\Models\User\User;
use Carbon\CarbonInterface;
use Database\Factories\Quiz\QuizFactory;
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
 * @property-read string|null $description
 * @property-read string $allocated_time
 * @property-read CarbonInterface|null $public_at
 * @property-read string $hash
 * @property-read CarbonInterface $created_at
 * @property-read CarbonInterface $updated_at
 * @property-read CarbonInterface|null $deleted_at
 *
 * Relationships:
 * @property-read User $teacher
 * @property-read Collection<QuizQuestion> $questions
 * @property-read Collection<QuizSubmission> $submissions
 */
#[UseFactory(QuizFactory::class)]
final class Quiz extends Model
{
    use HasFactory, SoftDeletes;
    use HasRelations;

    protected $fillable = [
        'teacher_id',
        'title',
        'slug',
        'description',
        'allocated_time',
        'public_at',
        'hash'
    ];

    protected function casts(): array
    {
        return [
            'public_at' => 'datetime',
        ];
    }
}
