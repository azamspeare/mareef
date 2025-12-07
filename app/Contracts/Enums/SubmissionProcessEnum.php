<?php

namespace App\Contracts\Enums;

use App\Contracts\Enums\Traits\HasDefaults;
use App\Contracts\Interfaces\Enumable;

enum SubmissionProcessEnum : string implements Enumable
{
    use HasDefaults;

    case IN_PROGRESS = 'in_progress';
    case COMPLETED = 'completed';
    case FAILED = 'failed';

    public static function isInProgress(string $status): bool
    {
        return mb_strtolower($status) === self::IN_PROGRESS->value;
    }

    public static function isCompleted(string $status): bool
    {
        return mb_strtolower($status) === self::COMPLETED->value;
    }

    public static function isFailed(string $status): bool
    {
        return mb_strtolower($status) === self::FAILED->value;
    }
}
