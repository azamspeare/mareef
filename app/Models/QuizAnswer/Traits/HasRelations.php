<?php

declare(strict_types=1);

namespace App\Models\QuizAnswer\Traits;

use App\Models\QuizQuestion\QuizQuestion;
use App\Models\Submission\Quiz\QuizSubmission;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

trait HasRelations
{
    public function submission(): BelongsTo
    {
        return $this->belongsTo(QuizSubmission::class, 'submission_id', 'id');
    }

    public function question(): BelongsTo
    {
        return $this->belongsTo(QuizQuestion::class, 'question_id', 'id');
    }
}
