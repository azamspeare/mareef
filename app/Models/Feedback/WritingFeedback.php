<?php

declare(strict_types=1);

namespace App\Models\Feedback;

use App\Models\Feedback\Traits\HasRelations;
use App\Models\Submission\WritingSubmission;
use App\Models\User\User;
use Carbon\CarbonInterface;
use Database\Factories\WritingFeedbackFactory;
use Illuminate\Database\Eloquent\Attributes\UseFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Attributes:
 * @property-read int $id
 * @property-read int $submission_id
 * @property-read int $teacher_id
 * @property-read array $content
 * @property-read float $score
 * @property-read string $feedback
 * @property-read CarbonInterface $created_at
 * @property-read CarbonInterface $updated_at
 *
 * Relationships:
 * @property-read WritingSubmission $submission
 * @property-read User $teacher
 */
#[UseFactory(WritingFeedbackFactory::class)]
final class WritingFeedback extends Model
{
    use HasFactory;
    use HasRelations;

    public $table = 'writing_feedbacks';

    protected $fillable = [
        'submission_id',
        'teacher_id',
        'content',
        'score',
        'feedback',
    ];

    protected function casts(): array
    {
        return [
            'content' => 'array',
            'score' => 'float',
        ];
    }
}
