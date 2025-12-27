<?php

declare(strict_types=1);

namespace App\Models\OtpCode\Traits;

use App\Models\User\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

trait HasRelations
{
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
