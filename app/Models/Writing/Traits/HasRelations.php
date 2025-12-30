<?php

declare(strict_types=1);

namespace App\Models\Writing\Traits;

use App\Models\Submission\Writing\WritingSubmission;
use App\Models\User\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

trait HasRelations
{
    public function teacher(): BelongsTo
    {
        return $this->belongsTo(User::class, 'teacher_id', 'id');
    }

    public function submissions(): HasMany
    {
        return $this->hasMany(WritingSubmission::class, 'writing_id', 'id');
    }
}
