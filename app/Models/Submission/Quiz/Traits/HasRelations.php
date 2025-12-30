<?php

declare(strict_types=1);

namespace App\Models\Submission\Quiz\Traits;

use App\Models\Quiz\Quiz;
use App\Models\QuizAnswer\QuizAnswer;
use App\Models\User\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

trait HasRelations
{
    public function quiz(): BelongsTo
    {
        return $this->belongsTo(Quiz::class, 'quiz_id', 'id');
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'student_id', 'id');
    }

    public function answers(): HasMany
    {
        return $this->hasMany(QuizAnswer::class, 'submission_id', 'id');
    }
}
