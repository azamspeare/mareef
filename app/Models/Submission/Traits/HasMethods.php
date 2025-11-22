<?php

namespace App\Models\Submission\Traits;

trait HasMethods
{
    public function isEvaluated(): bool
    {
        return $this->evaluated_at && $this->feedback;
    }
}
