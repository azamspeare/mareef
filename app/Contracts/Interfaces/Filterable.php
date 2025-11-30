<?php

declare(strict_types=1);

namespace App\Contracts\Interfaces;

use Illuminate\Http\Request;

interface Filterable
{
    public static function fromRequest(Request $request, int $teacher_id): self;
}
