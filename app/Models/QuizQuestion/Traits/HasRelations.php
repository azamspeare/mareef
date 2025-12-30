<?php

declare(strict_types=1);

namespace App\Models\QuizQuestion\Traits;

use App\Models\Quiz\Quiz;
use App\Models\QuizAnswer\QuizAnswer;
use App\Models\QuizOption\QuizOption;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

trait HasRelations
{
    public function quiz(): BelongsTo
    {
        return $this->belongsTo(Quiz::class, 'quiz_id', 'id');
    }

    public function options(): HasMany
    {
        return $this->hasMany(QuizOption::class, 'question_id', 'id');
    }

    public function answers(): HasMany
    {
        return $this->hasMany(QuizAnswer::class, 'question_id', 'id');
    }
}
