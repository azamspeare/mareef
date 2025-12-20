<?php

declare(strict_types=1);

namespace App\Models\OtpCode;

use App\Models\OtpCode\Traits\HasRelations;
use App\Models\User\User;
use Carbon\CarbonInterface;
use Database\Factories\Codes\OtpCodesFactory;
use Illuminate\Database\Eloquent\Attributes\UseFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Attributes:
 * @property-read int $id
 * @property-read int $user_id
 * @property-read string $code
 * @property-read CarbonInterface $expires_at
 * @property-read CarbonInterface $created_at
 * @property-read CarbonInterface $updated_at
 *
 * Relationships:
 * @property-read User $user
 */
#[UseFactory(OtpCodesFactory::class)]
class OtpCode extends Model
{
    use HasFactory, HasRelations;

    protected $fillable = [
        'user_id',
        'code',
        'expires_at'
    ];

    protected function casts(): array
    {
        return [
            'expires_at' => 'datetime',
        ];
    }
}
