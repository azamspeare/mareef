<?php

namespace App\Models\Submission;

use App\Models\Feedback\WritingFeedback;
use App\Models\User\User;
use App\Models\Writing\Writing;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class WritingSubmission extends Model
{
    protected $fillable = [
        'writing_id',
        'student_id',
        'content',
        'spent_time',
        'submitted_at',
        'evaluated_at',
    ];

    protected function casts(): array
    {
        return [
            'content' => 'array',
            'submitted_at' => 'datetime',
            'evaluated_at' => 'datetime',
        ];
    }

    public function writing(): BelongsTo
    {
        return $this->belongsTo(Writing::class);
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function feedback(): HasOne
    {
        return $this->hasOne(WritingFeedback::class, 'submission_id');
    }
}
