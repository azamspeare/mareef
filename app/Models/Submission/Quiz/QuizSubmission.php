<?php

declare(strict_types=1);

namespace App\Models\Submission\Quiz;

use App\Models\Quiz\Quiz;
use App\Models\QuizAnswer\QuizAnswer;
use App\Models\Submission\Quiz\Traits\HasMethods;
use App\Models\Submission\Quiz\Traits\HasRelations;
use App\Models\User\User;
use App\Observers\Submission\QuizSubmissionObserver;
use Carbon\CarbonInterface;
use Database\Factories\Quiz\QuizSubmissionFactory;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Attributes\UseFactory;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Attributes:
 * @property-read int $id
 * @property-read int $quiz_id
 * @property-read int $student_id
 * @property-read int $score
 * @property-read string|null $spent_time
 * @property-read string|null $submitted_at
 * @property-read string|null $feedback
 * @property-read CarbonInterface|null $evaluated_at
 * @property-read string $status
 * @property-read CarbonInterface $created_at
 * @property-read CarbonInterface $updated_at
 * @property-read CarbonInterface|null $deleted_at
 *
 * Relationships:
 * @property-read Quiz $quiz
 * @property-read User $student
 * @property-read Collection<QuizAnswer> $answers
 */
#[UseFactory(QuizSubmissionFactory::class)]
#[ObservedBy(QuizSubmissionObserver::class)]
final class QuizSubmission extends Model
{
    use HasFactory;
    use HasRelations, HasMethods;

    protected $fillable = [
        'quiz_id',
        'student_id',
        'score',
        'spent_time',
        'submitted_at',
        'feedback',
        'evaluated_at',
        'status'
    ];

    protected function casts(): array
    {
        return [
            'submitted_at' => 'datetime',
        ];
    }
}
