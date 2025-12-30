<?php

namespace App\Contracts\Enums;

use App\Contracts\Enums\Traits\HasDefaults;
use App\Contracts\Interfaces\Enumable;

enum QuizTypeEnum : string implements Enumable
{
    use HasDefaults;

    case SINGLE_CHOICE = 'single_choice';
    case MULTIPLE_CHOICE = 'multiple_choice';
    case TRUE_FALSE = 'true_false';
    case SHORT_ANSWER = 'short_answer';
    case LONG_ANSWER = 'long_answer';
}
