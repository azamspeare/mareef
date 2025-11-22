<?php

declare(strict_types=1);

namespace App\Models\Feedback\Traits;

use App\Models\Submission\WritingSubmission;
use App\Models\User\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

trait HasRelations
{
    public function submission(): BelongsTo
    {
        return $this->belongsTo(WritingSubmission::class, 'submission_id', 'id');
    }

    public function teacher(): BelongsTo
    {
        return $this->belongsTo(User::class, 'teacher_id', 'id');
    }
}
