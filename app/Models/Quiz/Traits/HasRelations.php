<?php

declare(strict_types=1);

namespace App\Models\Quiz\Traits;

use App\Models\QuizQuestion\QuizQuestion;
use App\Models\Submission\Quiz\QuizSubmission;
use App\Models\User\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

trait HasRelations
{
    public function teacher(): BelongsTo
    {
        return $this->belongsTo(User::class, 'teacher_id', 'id');
    }

    public function questions(): HasMany
    {
        return $this->hasMany(QuizQuestion::class, 'quiz_id', 'id');
    }

    public function submissions(): HasMany
    {
        return $this->hasMany(QuizSubmission::class, 'quiz_id', 'id');
    }
}
