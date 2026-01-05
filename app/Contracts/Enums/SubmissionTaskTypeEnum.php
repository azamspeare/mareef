<?php

declare(strict_types=1);

namespace App\Contracts\Enums;

use App\Contracts\Enums\Traits\HasDefaults;
use App\Contracts\Interfaces\Enumable;

enum SubmissionTaskTypeEnum: string implements Enumable
{
    use HasDefaults;

    case ALL = 'all';
    case WRITING = 'writing';
    case QUIZ = 'quiz';

    public static function isAll(string $type): bool
    {
        return mb_strtolower($type) === self::ALL->value;
    }

    public static function isWriting(string $type): bool
    {
        return mb_strtolower($type) === self::WRITING->value;
    }

    public static function isQuiz(string $type): bool
    {
        return mb_strtolower($type) === self::QUIZ->value;
    }
}
