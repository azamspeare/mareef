<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Services\Image\CreateImageService;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

final class CleanupTempImagesCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'images:cleanup {--hours=24 : Delete images older than this many hours}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Delete orphaned temporary images that were never attached to a writing.';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $hours = (int) $this->option('hours');
        $cutoff = Carbon::now()->subHours($hours);

        $files = Storage::files(CreateImageService::TEMP_PATH);
        $deletedCount = 0;

        foreach ($files as $file) {
            $lastModified = Carbon::createFromTimestamp(Storage::lastModified($file));

            if ($lastModified->isBefore($cutoff)) {
                Storage::delete($file);
                $deletedCount++;
            }
        }

        $this->info("Deleted {$deletedCount} orphaned temporary image(s) older than {$hours} hour(s).");

        return self::SUCCESS;
    }
}
