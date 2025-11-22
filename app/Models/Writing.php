<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Writing extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'teacher_id',
        'title',
        'slug',
        'content',
        'allocated_time',
        'public_at',
    ];

    protected function casts(): array
    {
        return [
            'content' => 'array',
            'public_at' => 'datetime',
        ];
    }

    public function teacher(): BelongsTo
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    public function submissions(): HasMany
    {
        return $this->hasMany(WritingSubmission::class);
    }
}
