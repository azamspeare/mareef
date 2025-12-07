<?php

declare(strict_types=1);

namespace App\Services\Image;

use App\Contracts\Abstracts\Service\AbstractService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

final class CreateImageService extends AbstractService
{
    public const TEMP_PATH = 'writings/temp';
    public const PERMANENT_PATH = 'writings/images';

    public function __construct(
        private readonly UploadedFile $file
    ) {}

    public function handle(): void
    {
        $extension = $this->file->getClientOriginalExtension();
        $filename = Str::uuid() . '.' . $extension;
        $path = self::TEMP_PATH . '/' . $filename;

        Storage::put($path, $this->file->getContent());

        $this->setResult([
            'filename' => $filename,
            'path' => $path,
        ]);
    }
}
