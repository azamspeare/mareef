<?php

declare(strict_types=1);

namespace App\Helpers\Content;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

final class BlockNoteContentHelper
{
    /**
     * Process BlockNote content to download and store images locally
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

                // Only process external URLs (tmpfiles.org or other CDNs)
                if (str_starts_with($url, 'http://') || str_starts_with($url, 'https://')) {
                    $storedPath = self::downloadAndStoreImage($url);

                    if ($storedPath) {
                        $content[$index]['props']['url'] = $storedPath;
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
     * Download image from URL and store in local storage
     */
    private static function downloadAndStoreImage(string $url): ?string
    {
        try {
            // Download image content
            $imageContent = file_get_contents($url);

            if ($imageContent === false) {
                return null;
            }

            // Generate unique filename
            $extension = pathinfo(parse_url($url, PHP_URL_PATH), PATHINFO_EXTENSION) ?: 'jpg';
            $filename = Str::uuid() . '.' . $extension;
            $path = 'writings/images/' . $filename;

            // Store in private storage
            Storage::put($path, $imageContent);

            return $path;
        } catch (\Exception $e) {
            // Log error and return null to keep original URL
            \Log::error('Failed to download image: ' . $e->getMessage(), ['url' => $url]);
            return null;
        }
    }
}
