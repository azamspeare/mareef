<?php

declare(strict_types=1);

namespace App\Http\Controllers\Teacher\Writing;

use App\Actions\Submission\Writing\ArchiveWritingSubmissionAction;
use App\DTOs\Writing\WritingFeedbackDTO;
use App\Handlers\ServiceHandler;
use App\Http\Controllers\Controller;
use App\Http\Requests\Teacher\Writing\EvaluateWritingSubmissionRequest;
use App\Queries\Submission\SubmissionFindByIDQuery;
use App\Services\Writing\EvaluateWritingSubmissionService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class WritingSubmissionController extends Controller
{
    /**
     * Display the specified resource.
     */
    public function show(Request $request, int $id, SubmissionFindByIDQuery $query): Response
    {
        $teacher = $request->user();

        return Inertia::render('Teacher/Writings/Submission', [
            'submission' => $query->query(['id' => $id, 'teacher_id' => $teacher->id]),
        ]);
    }

    /**
     * Evaluate a resource in storage.
     */
    public function evaluate(EvaluateWritingSubmissionRequest $request, int $id, SubmissionFindByIDQuery $query, ServiceHandler $handler): RedirectResponse
    {
        $teacher = $request->user();
        $submission = $query->query(['id' => $id, 'teacher_id' => $teacher->id]);

        $dto = WritingFeedbackDTO::make($request->validated(), $teacher->id);

        $result = $handler->handle(new EvaluateWritingSubmissionService($dto, $submission));
        if (! $result) {
            return redirect()->back()->withErrors(['message' => 'Failed to evaluate submission.']);
        }

        return redirect()->back()->with('success', 'Submission evaluated successfully.');
    }

    /**
     * Archive a resource in storage.
     */
    public function archive(Request $request, int $id, SubmissionFindByIDQuery $query, ArchiveWritingSubmissionAction $action): RedirectResponse
    {
        $teacher = $request->user();
        $submission = $query->query(['id' => $id, 'teacher_id' => $teacher->id]);

        $result = $action->run($submission);
        if (! $result) {
            return redirect()->back()->with('error', 'Failed to delete submission.');
        }

        return redirect()->back()->with('success', 'Submission deleted successfully.');
    }
}
