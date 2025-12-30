<?php

declare(strict_types=1);

namespace App\Models\Submission\Writing\Traits;

use App\Models\Feedback\WritingFeedback;
use App\Models\User\User;
use App\Models\Writing\Writing;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

trait HasRelations
{
    public function writing(): BelongsTo
    {
        return $this->belongsTo(Writing::class, 'writing_id', 'id');
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'student_id', 'id');
    }

    public function feedback(): HasOne
    {
        return $this->hasOne(WritingFeedback::class, 'submission_id', 'id');
    }
}
