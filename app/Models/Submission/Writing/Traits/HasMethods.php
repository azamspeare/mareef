<?php

namespace App\Models\Submission\Writing\Traits;

use App\Contracts\Enums\SubmissionProcessEnum;

trait HasMethods
{
    public function isEvaluated(): bool
    {
        return $this->evaluated_at && $this->feedback;
    }

    public function isCompleted(): bool
    {
        return filled($this->submitted_at) && SubmissionProcessEnum::isCompleted($this->status);
    }
}
