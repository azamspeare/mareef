<?php

declare(strict_types=1);

namespace App\Models\QuizOption\Traits;

use App\Models\QuizQuestion\QuizQuestion;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

trait HasRelations
{
    public function question(): BelongsTo
    {
        return $this->belongsTo(QuizQuestion::class, 'question_id', 'id');
    }
}
