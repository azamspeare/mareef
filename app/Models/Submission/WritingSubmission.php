<?php

declare(strict_types=1);

namespace App\Models\Submission;

use App\Models\Feedback\WritingFeedback;
use App\Models\Submission\Traits\HasMethods;
use App\Models\Submission\Traits\HasRelations;
use App\Models\User\User;
use App\Models\Writing\Writing;
use Carbon\CarbonInterface;
use Database\Factories\WritingSubmissionFactory;
use Illuminate\Database\Eloquent\Attributes\UseFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Attributes:
 * @property-read int $id
 * @property-read int $writing_id
 * @property-read int $student_id
 * @property-read array $content
 * @property-read string $spent_time
 * @property-read CarbonInterface $submitted_at
 * @property-read CarbonInterface|null $evaluated_at
 * @property-read string $status
 * @property-read CarbonInterface $created_at
 * @property-read CarbonInterface $updated_at
 * @property-read CarbonInterface|null $deleted_at
 *
 * Relationships:
 * @property-read Writing $writing
 * @property-read User $student
 * @property-read WritingFeedback|null $feedback
 */
#[UseFactory(WritingSubmissionFactory::class)]
final class WritingSubmission extends Model
{
    use HasFactory;
    use HasRelations, HasMethods, SoftDeletes;

    protected $fillable = [
        'writing_id',
        'student_id',
        'content',
        'spent_time',
        'submitted_at',
        'evaluated_at',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'content' => 'array',
            'submitted_at' => 'datetime',
            'evaluated_at' => 'datetime',
        ];
    }
}
