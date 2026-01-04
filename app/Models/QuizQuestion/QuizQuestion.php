<?php

declare(strict_types=1);

namespace App\Models\QuizQuestion;

use App\Models\Quiz\Quiz;
use App\Models\QuizOption\QuizOption;
use App\Models\QuizQuestion\Traits\HasRelations;
use Carbon\CarbonInterface;
use Database\Factories\Quiz\QuizQuestionFactory;
use Illuminate\Database\Eloquent\Attributes\UseFactory;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Attributes:
 * @property-read int $id
 * @property-read int $quiz_id
 * @property-read string $type
 * @property-read string $content
 * @property-read int $order
 * @property-read int $point
 * @property-read CarbonInterface $created_at
 * @property-read CarbonInterface $updated_at
 * @property-read CarbonInterface|null $deleted_at
 *
 * Relationships:
 * @property-read Quiz $quiz
 * @property-read Collection<QuizOption> $options
 */
#[UseFactory(QuizQuestionFactory::class)]
final class QuizQuestion extends Model
{
    use HasFactory, HasRelations, SoftDeletes;

    protected $fillable = [
        'quiz_id',
        'type',
        'content',
        'order',
        'point'
    ];
}
