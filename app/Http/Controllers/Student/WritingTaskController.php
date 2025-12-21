<?php

declare(strict_types=1);

namespace App\Http\Controllers\Student;

use App\Actions\Submission\CreateSubmissionAction;
use App\Actions\Submission\UpdateSubmissionAction;
use App\Contracts\Enums\SubmissionProcessEnum;
use App\DTOs\Submission\SubmissionDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Student\Submission\FinishSubmissionRequest;
use App\Http\Requests\Student\Submission\StartSubmissionRequest;
use App\Http\Requests\Student\Submission\StoreSubmissionRequest;
use App\Queries\Submission\SubmissionFindByWritingAndStudentIDQuery;
use App\Queries\User\TeacherFindByUsernameQuery;
use App\Queries\Writing\WritingFindBySlugQuery;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class WritingTaskController extends Controller
{
    public function __construct(
        protected TeacherFindByUsernameQuery $teacherQuery,
        protected WritingFindBySlugQuery $writingQuery,
        protected SubmissionFindByWritingAndStudentIDQuery $submissionQuery,
    ) {
    }

    public function create(Request $request, string $handle, string $slug): Response
    {
        $teacher = $this->teacherQuery->query(['username' => $handle]);
        if (! $teacher) {
            abort(404);
        }

        $writing = $this->writingQuery->query(['slug' => $slug, 'teacher_id' => $teacher->id]);
        if (! $writing) {
            abort(404);
        }

        $submission = null;
        if ($request->user()) {
            $submission = $this->submissionQuery->query([
                'writing_id' => $writing->id,
                'student_id' => $request->user()->id
            ]);
        }

        return Inertia::render('Student/WritingTask', [
            'writing' => $writing,
            'submission' => $submission,
            'seo' => [
                'title' => $writing->title . ' - Writing Task',
                'description' => 'Complete your writing task on Mareef.',
                'image' => '/images/og/writing-task.png',
            ],
        ]);
    }

    public function start(StartSubmissionRequest $request, CreateSubmissionAction $action): RedirectResponse
    {
        $attributes = $request->validated();

        $student = $request->user();
        $submission = $this->submissionQuery->query(['writing_id' => $attributes['writing_id'], 'student_id' => $student->id]);

        if ($submission) {
            return redirect()->back()->with('error', 'You have already started this task.');
        }

        $dto = SubmissionDTO::make($attributes, $student->id);

        $action->run($dto);

        return redirect()->back()->with('success', 'Task started! Good luck!');
    }

    public function update(StoreSubmissionRequest $request, UpdateSubmissionAction $action): RedirectResponse
    {
        $student = $request->user();
        $attributes = $request->validated();

        $submission = $this->submissionQuery->query(['writing_id' => $attributes['writing_id'], 'student_id' => $student->id]);

        if (! $submission) {
            return redirect()->back()->with('error', 'Please start the task first before submitting.');
        }

        if (! SubmissionProcessEnum::isInProgress($submission->status)) {
            return redirect()->back()->with('error', 'This task has already been completed.');
        }

        $dto = SubmissionDTO::make($attributes, $student->id);

        $action->run($submission, $dto);

        return redirect()->back();
    }

    public function finish(FinishSubmissionRequest $request, UpdateSubmissionAction $action): RedirectResponse
    {
        $attributes = $request->validated();

        $student = $request->user();
        $submission = $this->submissionQuery->query(['writing_id' => $attributes['writing_id'], 'student_id' => $student->id]);

        if (! $submission) {
            return back()->with('error', 'No active submission found.');
        }

        if (! SubmissionProcessEnum::isInProgress($submission->status)) {
            return back()->with('error', 'This task has already been completed.');
        }

        $attributes['status'] = SubmissionProcessEnum::COMPLETED->value;
        $attributes['submitted_at'] = now();

        $dto = SubmissionDTO::make($attributes, $student->id);

        $action->run($submission, $dto);

        return back()->with('success', 'Task completed successfully! Your teacher will review it soon.');
    }
}
