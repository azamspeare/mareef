<?php

declare(strict_types=1);

namespace App\Http\Controllers\Dashboard\Writing;

use App\Actions\Submission\ArchiveSubmissionAction;
use App\DTOs\Feedback\FeedbackDTO;
use App\Filters\Submission\SubmissionFilter;
use App\Handlers\ServiceHandler;
use App\Http\Controllers\Controller;
use App\Http\Requests\Submission\EvaluateSubmissionRequest;
use App\Queries\Submission\SubmissionFindForListQuery;
use App\Queries\Submission\SubmissionFindByIDQuery;
use App\Services\Feedback\EvaluateSubmissionService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class SubmissionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, SubmissionFindForListQuery $query): Response
    {
        $teacher = $request->user();
        $filter = SubmissionFilter::fromRequest($request, $teacher->id);

        return Inertia::render('Submissions/Index', [
            'submissions' => $query->query($filter),
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, int $id, SubmissionFindByIDQuery $query): Response
    {
        $teacher = $request->user();

        return Inertia::render('Submissions/Show', [
            'submission' => $query->query(['id' => $id, 'teacher_id' => $teacher->id]),
        ]);
    }

    /**
     * Evaluate a resource in storage.
     */
    public function evaluate(EvaluateSubmissionRequest $request, int $id, SubmissionFindByIDQuery $query, ServiceHandler $handler): RedirectResponse
    {
        $teacher = $request->user();
        $submission = $query->query(['id' => $id, 'teacher_id' => $teacher->id]);

        $dto = FeedbackDTO::make($request->validated(), $teacher->id);

        $result = $handler->handle(new EvaluateSubmissionService($dto, $submission));
        if (! $result) {
            return redirect()->back()->withErrors(['message' => 'Failed to evaluate submission.']);
        }

        return redirect()->back()->with('success', 'Submission evaluated successfully.');
    }

    /**
     * Archive a resource in storage.
     */
    public function archive(Request $request, int $id, SubmissionFindByIDQuery $query, ArchiveSubmissionAction $action): RedirectResponse
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
