<?php

declare(strict_types=1);

namespace App\Http\Controllers\Teacher\Quiz;

use App\Actions\Quiz\Bulk\ArchiveQuizzesAction;
use App\Actions\Quiz\Bulk\RestoreQuizzesAction;
use App\Filters\Quiz\QuizFilter;
use App\Http\Controllers\Controller;
use App\Http\Requests\Reusable\BulkActionRequest;
use Illuminate\Http\RedirectResponse;

final class QuizBulkController extends Controller
{
    /**
     * Archive the specified resource from storage.
     */
    public function archive(BulkActionRequest $request, ArchiveQuizzesAction $action): RedirectResponse
    {
        $teacher = $request->user();
        $attributes = $request->validated();

        $result = $action->run($attributes['ids'], $teacher->id);
        if (! $result) {
            return back()->with('error', 'Failed to archive quizzes.');
        }

        $filter = QuizFilter::fromRequest($request, $teacher->id);
        $count = count($attributes['ids']);

        return redirect()->route('quizzes.index', $filter->toRedirectParams())
            ->with('success', "{$count} quiz" . ($count > 1 ? 'zes' : '') . " archived successfully.");
    }

    /**
     * Restore the specified resource from storage.
     */
    public function restore(BulkActionRequest $request, RestoreQuizzesAction $action): RedirectResponse
    {
        $teacher = $request->user();
        $attributes = $request->validated();

        $result = $action->run($attributes['ids'], $teacher->id);
        if (! $result) {
            return back()->with('error', 'Failed to restore quizzes.');
        }

        $filter = QuizFilter::fromRequest($request, $teacher->id);
        $count = count($attributes['ids']);

        return redirect()->route('quizzes.index', $filter->toRedirectParams())
            ->with('success', "{$count} quiz" . ($count > 1 ? 'zes' : '') . " restored successfully.");
    }
}
