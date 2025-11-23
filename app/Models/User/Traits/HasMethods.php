<?php

declare(strict_types=1);

namespace App\Models\User\Traits;

use App\Contracts\Enums\RoleEnum;

trait HasMethods
{
    /**
     * Check if the user is an admin.
     */
    public function isAdmin(): bool
    {
        return mb_strtolower($this->role) === RoleEnum::ADMIN->value;
    }

    /**
     * Check if the user is a teacher.
     */
    public function isTeacher(): bool
    {
        return mb_strtolower($this->role) === RoleEnum::TEACHER->value;
    }

    /**
     * Check if the user is a student.
     */
    public function isStudent(): bool
    {
        return mb_strtolower($this->role) === RoleEnum::STUDENT->value;
    }

    /**
     * Check if the user has a specific role.
     */
    public function hasRole(string|RoleEnum $role): bool
    {
        $roleValue = $role instanceof RoleEnum ? $role->value : $role;

        return mb_strtolower($this->role) === mb_strtolower($roleValue);
    }
}
