<?php

declare(strict_types=1);

namespace App\Models\Waitlist;

use Carbon\CarbonInterface;
use Database\Factories\WritingFactory;
use Illuminate\Database\Eloquent\Attributes\UseFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Attributes:
 * @property-read int $id
 * @property-read string $email
 * @property-read CarbonInterface $created_at
 * @property-read CarbonInterface $updated_at
 */
#[UseFactory(WritingFactory::class)]
final class Waitlist extends Model
{
    use HasFactory;

    protected $fillable = [
        'email',
    ];
}
