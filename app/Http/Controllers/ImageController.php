<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Handlers\ServiceHandler;
use App\Http\Requests\Image\StoreImageRequest;
use App\Services\Image\CreateImageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

final class ImageController extends Controller
{
    /**
     * Upload image to temporary storage.
     */
    public function store(StoreImageRequest $request, ServiceHandler $handler): JsonResponse
    {
        $result = $handler->handle(new CreateImageService($request->file('file')));

        if (! $result) {
            return response()->json(['error' => 'Failed to upload image.'], 500);
        }

        $filename = $result['data']['filename'];
        $url = route('images.show', ['filename' => $filename]);

        return response()->json(['url' => $url]);
    }

    /**
     * Serve image from storage (checks both temp and permanent paths).
     */
    public function show(string $filename): StreamedResponse
    {
        // Check the permanent path first, then temp path
        $permanentPath = CreateImageService::PERMANENT_PATH . '/' . $filename;
        $tempPath = CreateImageService::TEMP_PATH . '/' . $filename;

        $path = match (true) {
            Storage::exists($permanentPath) => $permanentPath,
            Storage::exists($tempPath) => $tempPath,
            default => null,
        };

        if ($path === null) {
            abort(404);
        }

        $mimeType = Storage::mimeType($path);

        // Use a shorter cache for temp images, longer for permanent
        $cacheControl = str_contains($path, '/temp/')
            ? 'public, max-age=3600'
            : 'public, max-age=31536000';

        return Storage::response($path, null, [
            'Content-Type' => $mimeType,
            'Cache-Control' => $cacheControl,
        ]);
    }
}
