<?php

declare(strict_types=1);

namespace App\Http\Controllers\Teacher\Quiz;

use App\Actions\Submission\Quiz\ArchiveQuizSubmissionAction;
use App\Actions\Submission\Quiz\EvaluateQuizSubmissionAction;
use App\DTOs\Quiz\QuizFeedbackDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Teacher\Quiz\EvaluateQuizSubmissionRequest;
use App\Queries\Quiz\QuizSubmissionFindByIDQuery;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class QuizSubmissionController extends Controller
{
    /**
     * Display the specified resource.
     */
    public function show(Request $request, int $id, QuizSubmissionFindByIDQuery $query): Response
    {
        $teacher = $request->user();

        return Inertia::render('Teacher/Quizzes/Submission', [
            'submission' => $query->query(['id' => $id, 'teacher_id' => $teacher->id]),
        ]);
    }

    /**
     * Evaluate a resource in storage.
     */
    public function evaluate(EvaluateQuizSubmissionRequest $request, int $id, QuizSubmissionFindByIDQuery $query, EvaluateQuizSubmissionAction $action): RedirectResponse
    {
        $teacher = $request->user();
        $submission = $query->query(['id' => $id, 'teacher_id' => $teacher->id]);

        $dto = QuizFeedbackDTO::make($request->validated());

        $result = $action->run($submission, $dto);
        if (! $result) {
            return redirect()->back()->withErrors(['message' => 'Failed to evaluate submission.']);
        }

        return redirect()->back()->with('success', 'Submission evaluated successfully.');
    }

    /**
     * Archive a resource in storage.
     */
    public function archive(Request $request, int $id, QuizSubmissionFindByIDQuery $query, ArchiveQuizSubmissionAction $action): RedirectResponse
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
