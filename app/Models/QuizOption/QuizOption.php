<?php

declare(strict_types=1);

namespace App\Models\QuizOption;

use App\Models\QuizOption\Traits\HasRelations;
use App\Models\QuizQuestion\QuizQuestion;
use Carbon\CarbonInterface;
use Database\Factories\Quiz\QuizOptionFactory;
use Illuminate\Database\Eloquent\Attributes\UseFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Attributes:
 * @property-read int $id
 * @property-read int $question_id
 * @property-read string $content
 * @property-read bool $is_correct
 * @property-read int $order
 * @property-read CarbonInterface $created_at
 * @property-read CarbonInterface $updated_at
 * @property-read CarbonInterface|null $deleted_at
 *
 * Relationships:
 * @property-read QuizQuestion $question
 */
#[UseFactory(QuizOptionFactory::class)]
final class QuizOption extends Model
{
    use HasFactory, HasRelations, SoftDeletes;

    protected $fillable = [
        'question_id',
        'content',
        'is_correct',
        'order'
    ];

    protected function casts(): array
    {
        return [
            'is_correct' => 'bool',
        ];
    }
}
