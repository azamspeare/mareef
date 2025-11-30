<?php

declare(strict_types=1);

namespace App\Http\Controllers\Dashboard\Writing;

use App\Actions\Writing\Bulk\ArchiveWritingsAction;
use App\Actions\Writing\Bulk\DeleteWritingsAction;
use App\Actions\Writing\Bulk\RestoreWritingsAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Writing\BulkWritingRequest;
use Illuminate\Http\RedirectResponse;

final class WritingBulkController extends Controller
{
    /**
     * Archive the specified resource from storage.
     */
    public function archive(BulkWritingRequest $request, ArchiveWritingsAction $action): RedirectResponse
    {
        $teacher = $request->user();
        $attributes = $request->validated();

        $result = $action->run($attributes['ids'], $teacher->id);
        if (! $result) {
            return back()->withErrors(['error' => 'Failed to archive writings.']);
        }

        return redirect()->route('writings.index');
    }

    /**
     * Restore the specified resource from storage.
     */
    public function restore(BulkWritingRequest $request, RestoreWritingsAction $action): RedirectResponse
    {
        $teacher = $request->user();
        $attributes = $request->validated();

        $result = $action->run($attributes['ids'], $teacher->id);
        if (! $result) {
            return back()->withErrors(['error' => 'Failed to restore writings.']);
        }

        return redirect()->route('writings.index');
    }

    /**
     * Delete the specified resource from storage.
     */
    public function delete(BulkWritingRequest $request, DeleteWritingsAction $action): RedirectResponse
    {
        $teacher = $request->user();
        $attributes = $request->validated();

        $result = $action->run($attributes['ids'], $teacher->id);
        if (! $result) {
            return back()->withErrors(['error' => 'Failed to delete writings.']);
        }

        return redirect()->route('writings.index');
    }
}
