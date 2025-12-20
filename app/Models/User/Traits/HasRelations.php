<?php

declare(strict_types=1);

namespace App\Models\User\Traits;

use App\Models\Feedback\WritingFeedback;
use App\Models\Submission\WritingSubmission;
use App\Models\Telegram\TelegramUser;
use App\Models\Writing\Writing;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

trait HasRelations
{
    /**
     * Get the writings created by this teacher
     */
    public function writings(): HasMany
    {
        return $this->hasMany(Writing::class, 'teacher_id', 'id');
    }

    /**
     * Get the submissions made by this student
     */
    public function submissions(): HasMany
    {
        return $this->hasMany(WritingSubmission::class, 'student_id', 'id');
    }

    /**
     * Get the feedbacks given by this teacher
     */
    public function feedbacks(): HasMany
    {
        return $this->hasMany(WritingFeedback::class, 'teacher_id', 'id');
    }

    /**
     * Get the telegram user associated with this user.
     */
    public function telegramUser(): HasOne
    {
        return $this->hasOne(TelegramUser::class, 'user_id', 'id');
    }
}
