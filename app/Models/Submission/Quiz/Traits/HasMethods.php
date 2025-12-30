<?php

declare(strict_types=1);

namespace App\Models\Submission\Quiz\Traits;

use App\Contracts\Enums\SubmissionProcessEnum;

trait HasMethods
{
    public function isCompleted(): bool
    {
        return filled($this->submitted_at) && SubmissionProcessEnum::isCompleted($this->status);
    }
}
