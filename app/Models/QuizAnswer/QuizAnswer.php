<?php

declare(strict_types=1);

namespace App\Models\QuizAnswer;

use App\Models\QuizAnswer\Traits\HasRelations;
use App\Models\QuizQuestion\QuizQuestion;
use App\Models\Submission\Quiz\QuizSubmission;
use Carbon\CarbonInterface;
use Database\Factories\Quiz\QuizAnswerFactory;
use Illuminate\Database\Eloquent\Attributes\UseFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Attributes:
 * @property-read int $id
 * @property-read int $submission_id
 * @property-read int $question_id
 * @property-read string|null $options
 * @property-read bool $is_correct
 * @property-read CarbonInterface $created_at
 * @property-read CarbonInterface $updated_at
 *
 * Relationships:
 * @property-read QuizSubmission $submission
 * @property-read QuizQuestion $question
 */
#[UseFactory(QuizAnswerFactory::class)]
final class QuizAnswer extends Model
{
    use HasFactory, HasRelations;

    protected $fillable = [
        'submission_id',
        'question_id',
        'options',
        'is_correct'
    ];

    protected function casts(): array
    {
        return [
            'options' => 'array',
            'is_correct' => 'bool',
        ];
    }
}
