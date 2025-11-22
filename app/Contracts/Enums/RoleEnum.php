<?php

declare(strict_types=1);

namespace App\Contracts\Enums;

use App\Contracts\Enums\Traits\HasDefaults;
use App\Contracts\Interfaces\Enumable;

enum RoleEnum : string implements Enumable
{
    use HasDefaults;

    case ADMIN = 'admin';
    case TEACHER = 'teacher';
    case STUDENT = 'student';

    public static function isAdmin(string $role): bool
    {
        return mb_strtolower($role) === self::ADMIN->value;
    }

    public static function isTeacher(string $role): bool
    {
        return mb_strtolower($role) === self::TEACHER->value;
    }

    public static function isStudent(string $role): bool
    {
        return mb_strtolower($role) === self::STUDENT->value;
    }
}
