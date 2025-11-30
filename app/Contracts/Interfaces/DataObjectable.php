<?php

namespace App\Contracts\Interfaces;

interface DataObjectable
{
    public function toArray(): array;
    public function toNonNullArray(): array;
}
