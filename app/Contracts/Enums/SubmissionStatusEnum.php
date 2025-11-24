<?php

namespace App\Contracts\Enums;

use App\Contracts\Enums\Traits\HasDefaults;
use App\Contracts\Interfaces\Enumable;

enum SubmissionStatusEnum : string implements Enumable
{
    use HasDefaults;

    case ALL = 'all';
    case NOT_REVIEWED = 'not_reviewed';
    case EVALUATED = 'evaluated';

    public static function isAll(string $status): bool
    {
        return mb_strtolower($status) === self::ALL->value;
    }

    public static function isNotReviewed(string $status): bool
    {
        return mb_strtolower($status) === self::NOT_REVIEWED->value;
    }

    public static function isEvaluated(string $status): bool
    {
        return mb_strtolower($status) === self::EVALUATED->value;
    }
}
