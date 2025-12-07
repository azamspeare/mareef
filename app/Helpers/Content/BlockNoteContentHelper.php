<?php

declare(strict_types=1);

namespace App\Helpers\Content;

use App\Services\Image\CreateImageService;
use Illuminate\Support\Facades\Storage;

final class BlockNoteContentHelper
{
    /**
     * Process BlockNote content to move images from temp to permanent storage.
     * Images are already uploaded to our temp storage via the image upload endpoint.
     */
    public static function processImages(array $content): array
    {
        foreach ($content as $index => $block) {
            if (!is_array($block)) {
                continue;
            }

            // Process image blocks
            if (isset($block['type']) && $block['type'] === 'image' && isset($block['props']['url'])) {
                $url = $block['props']['url'];
                $filename = self::extractFilename($url);

                if ($filename) {
                    $moved = self::moveToPermanentStorage($filename);

                    if ($moved) {
                        // URL stays the same since ImageController serves from both paths,
                        // but we could update it if needed
                        $content[$index]['props']['url'] = $url;
                    }
                }
            }

            // Recursively process children blocks
            if (isset($block['children']) && is_array($block['children']) && !empty($block['children'])) {
                $content[$index]['children'] = self::processImages($block['children']);
            }
        }

        return $content;
    }

    /**
     * Extract the filename from our image URL.
     */
    private static function extractFilename(string $url): ?string
    {
        // Match URLs like /images/{filename} or full URLs ending with /images/{filename}
        if (preg_match('/\/images\/([a-f0-9\-]+\.[a-z]+)$/i', $url, $matches)) {
            return $matches[1];
        }

        return null;
    }

    /**
     * Move the image from temp to permanent storage.
     */
    private static function moveToPermanentStorage(string $filename): bool
    {
        $tempPath = CreateImageService::TEMP_PATH . '/' . $filename;
        $permanentPath = CreateImageService::PERMANENT_PATH . '/' . $filename;

        // Already in permanent storage
        if (Storage::exists($permanentPath)) {
            return true;
        }

        // Not in temp storage (external URL or already moved)
        if (!Storage::exists($tempPath)) {
            return false;
        }

        return Storage::move($tempPath, $permanentPath);
    }
}
