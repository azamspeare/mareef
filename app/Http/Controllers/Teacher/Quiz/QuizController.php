<?php

declare(strict_types=1);

namespace App\Http\Controllers\Teacher\Quiz;

use App\Actions\Quiz\ArchiveQuizAction;
use App\Actions\Quiz\DeleteQuizAction;
use App\Actions\Quiz\RestoreQuizAction;
use App\DTOs\Quiz\QuizDTO;
use App\DTOs\Quiz\QuizQuestionDTO;
use App\Filters\Quiz\QuizFilter;
use App\Handlers\ServiceHandler;
use App\Http\Controllers\Controller;
use App\Http\Requests\Teacher\Quiz\StoreQuizRequest;
use App\Http\Requests\Teacher\Quiz\UpdateQuizRequest;
use App\Queries\Quiz\QuizFindByIDQuery;
use App\Queries\Quiz\QuizFindForListQuery;
use App\Services\Quiz\CreateQuizService;
use App\Services\Quiz\UpdateQuizService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class QuizController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, QuizFindForListQuery $query): Response
    {
        $teacher = $request->user();
        $filter = QuizFilter::fromRequest($request, $teacher->id);

        return Inertia::render('Teacher/Quizzes/Index', [
            'quizzes' => $query->query($filter),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('Teacher/Quizzes/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreQuizRequest $request, ServiceHandler $handler): RedirectResponse
    {
        $teacher = $request->user();
        $attributes = $request->validated();

        $quizDTO = QuizDTO::make($attributes, $teacher->id);
        $questionCollection = collect($attributes['questions'])->map(fn ($question) => QuizQuestionDTO::make($question));

        $result = $handler->handle(new CreateQuizService($quizDTO, $questionCollection));
        if (! $result) {
            return redirect()->back()->withErrors(['message' => 'Failed to create quiz.']);
        }

        return redirect()->route('quizzes.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, int $id, QuizFindByIDQuery $query)
    {
        $teacher = $request->user();

        return Inertia::render('Teacher/Quizzes/Show', [
            'quiz' => $query->withTrashed()->query(['id' => $id, 'teacher_id' => $teacher->id]),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Request $request, int $id, QuizFindByIDQuery $query)
    {
        $teacher = $request->user();

        return Inertia::render('Teacher/Quizzes/Edit', [
            'quiz' => $query->withTrashed()->query(['id' => $id, 'teacher_id' => $teacher->id]),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateQuizRequest $request, int $id, QuizFindByIDQuery $query, ServiceHandler $handler): RedirectResponse
    {
        $teacher = $request->user();
        $quiz = $query->withTrashed()->query(['id' => $id, 'teacher_id' => $teacher->id]);

        $attributes = $request->validated();

        $quizDTO = QuizDTO::make($attributes, $teacher->id);
        $questionCollection = collect($attributes['questions'])->map(fn ($question) => QuizQuestionDTO::make($question, $quiz->id));

        $result = $handler->handle(new UpdateQuizService($quiz, $quizDTO, $questionCollection));
        if (! $result) {
            return redirect()->back()->withErrors(['message' => 'Failed to update quiz.']);
        }

        return redirect()->route('quizzes.show', $quiz->id);
    }

    /**
     * Archive the specified resource from storage.
     */
    public function archive(Request $request, int $id, QuizFindByIDQuery $query, ArchiveQuizAction $action): RedirectResponse
    {
        $teacher = $request->user();
        $quiz = $query->query(['id' => $id, 'teacher_id' => $teacher->id]);

        $result = $action->run($quiz);
        if (! $result) {
            return redirect()->back()->with('error', 'Failed to archive quiz.');
        }

        $filter = QuizFilter::fromRequest($request, $teacher->id);

        return redirect()->route('quizzes.index', $filter->toRedirectParams())
            ->with('success', 'Quiz archived successfully.');
    }

    /**
     * Restore the specified resource from storage.
     */
    public function restore(Request $request, int $id, QuizFindByIDQuery $query, RestoreQuizAction $action): RedirectResponse
    {
        $teacher = $request->user();
        $quiz = $query->withTrashed()->query(['id' => $id, 'teacher_id' => $teacher->id]);

        $result = $action->run($quiz);
        if (! $result) {
            return redirect()->back()->with('error', 'Failed to restore quiz.');
        }

        $filter = QuizFilter::fromRequest($request, $teacher->id);

        return redirect()->route('quizzes.index', $filter->toRedirectParams())
            ->with('success', 'Quiz restored successfully.');
    }

    /**
     * Delete the specified resource from storage.
     */
    public function delete(Request $request, int $id, QuizFindByIDQuery $query, DeleteQuizAction $action): RedirectResponse
    {
        $teacher = $request->user();
        $quiz = $query->withTrashed()->query(['id' => $id, 'teacher_id' => $teacher->id]);

        $result = $action->run($quiz);
        if (! $result) {
            return redirect()->back()->with('error', 'Failed to delete quiz.');
        }

        $filter = QuizFilter::fromRequest($request, $teacher->id);

        return redirect()->route('quizzes.index', $filter->toRedirectParams())
            ->with('success', 'Quiz deleted successfully.');
    }
}
