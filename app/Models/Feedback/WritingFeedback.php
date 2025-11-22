<?php

namespace App\Models\Feedback;

use App\Models\Submission\WritingSubmission;
use App\Models\User\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WritingFeedback extends Model
{
    protected $fillable = [
        'submission_id',
        'teacher_id',
        'content',
        'score',
        'feedback',
    ];

    protected function casts(): array
    {
        return [
            'content' => 'array',
        ];
    }

    public function submission(): BelongsTo
    {
        return $this->belongsTo(WritingSubmission::class, 'submission_id');
    }

    public function teacher(): BelongsTo
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }
}
