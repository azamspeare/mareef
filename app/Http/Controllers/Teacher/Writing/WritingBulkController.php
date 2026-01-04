<?php

declare(strict_types=1);

namespace App\Http\Controllers\Teacher\Writing;

use App\Actions\Writing\Bulk\ArchiveWritingsAction;
use App\Actions\Writing\Bulk\RestoreWritingsAction;
use App\Filters\Writing\WritingFilter;
use App\Http\Controllers\Controller;
use App\Http\Requests\Reusable\BulkActionRequest;
use Illuminate\Http\RedirectResponse;

final class WritingBulkController extends Controller
{
    /**
     * Archive the specified resource from storage.
     */
    public function archive(BulkActionRequest $request, ArchiveWritingsAction $action): RedirectResponse
    {
        $teacher = $request->user();
        $attributes = $request->validated();

        $result = $action->run($attributes['ids'], $teacher->id);
        if (! $result) {
            return back()->with('error', 'Failed to archive writings.');
        }

        $filter = WritingFilter::fromRequest($request, $teacher->id);
        $count = count($attributes['ids']);

        return redirect()->route('writings.index', $filter->toRedirectParams())
            ->with('success', "{$count} writing" . ($count > 1 ? 's' : '') . " archived successfully.");
    }

    /**
     * Restore the specified resource from storage.
     */
    public function restore(BulkActionRequest $request, RestoreWritingsAction $action): RedirectResponse
    {
        $teacher = $request->user();
        $attributes = $request->validated();

        $result = $action->run($attributes['ids'], $teacher->id);
        if (! $result) {
            return back()->with('error', 'Failed to restore writings.');
        }

        $filter = WritingFilter::fromRequest($request, $teacher->id);
        $count = count($attributes['ids']);

        return redirect()->route('writings.index', $filter->toRedirectParams())
            ->with('success', "{$count} writing" . ($count > 1 ? 's' : '') . " restored successfully.");
    }
}
