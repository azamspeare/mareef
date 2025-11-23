<?php

declare(strict_types=1);

namespace App\Models\User;

use App\Models\Feedback\WritingFeedback;
use App\Models\Submission\WritingSubmission;
use App\Models\User\Traits\HasMethods;
use App\Models\User\Traits\HasRelations;
use App\Models\Writing\Writing;
use Carbon\CarbonInterface;
use Database\Factories\UserFactory;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Attributes\UseFactory;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

/**
 * Attributes:
 * @property-read int $id
 * @property-read string $name
 * @property-read string $email
 * @property-read string $username
 * @property-read CarbonInterface|null $email_verified_at
 * @property-read CarbonInterface|null $last_login_at
 * @property-read string $password
 * @property-read string $role
 * @property-read string|null $avatar
 * @property-read string|null $remember_token
 * @property-read CarbonInterface $created_at
 * @property-read CarbonInterface $updated_at
 * @property-read CarbonInterface|null $deleted_at
 *
 * Relationships:
 * @property-read Collection<Writing> $writings
 * @property-read Collection<WritingFeedback> $feedbacks
 * @property-read Collection<WritingSubmission> $submissions
 */
#[UseFactory(UserFactory::class)]
final class User extends Authenticatable implements MustVerifyEmail
{
    use HasFactory, Notifiable, SoftDeletes;
    use HasRelations, HasMethods;

    protected $fillable = [
        'name',
        'email',
        'username',
        'email_verified_at',
        'last_login_at',
        'password',
        'role',
        'avatar',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'last_login_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
