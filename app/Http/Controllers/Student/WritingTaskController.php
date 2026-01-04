<?php

declare(strict_types=1);

namespace App\Http\Controllers\Student;

use App\Actions\Submission\Writing\CreateWritingSubmissionAction;
use App\Actions\Submission\Writing\UpdateWritingSubmissionAction;
use App\Contracts\Enums\SubmissionProcessEnum;
use App\DTOs\Writing\WritingSubmissionDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Student\Writing\FinishWritingSubmissionRequest;
use App\Http\Requests\Student\Writing\StartWritingSubmissionRequest;
use App\Http\Requests\Student\Writing\StoreWritingSubmissionRequest;
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

    public function create(Request $request, string $handle, string $slug): Response|RedirectResponse
    {
        $teacher = $this->teacherQuery->query(['username' => $handle]);
        if (! $teacher) {
            abort(404);
        }

        $writing = $this->writingQuery->query(['slug' => $slug, 'teacher_id' => $teacher->id]);
        if (! $writing) {
            abort(404);
        }

        $user = $request->user();

        // Store task page URL for redirect after login/register/verification
        if (! $user || ! $user->phone_number || ! $user->hasVerifiedEmail()) {
            session()->put('student_auth_intended', '/' . $request->path());
        }

        // If authenticated but phone not registered, redirect to phone registration
        if ($user && ! $user->phone_number) {
            return redirect()->route('register.phone-number');
        }

        // If authenticated but phone not verified (OTP pending), redirect to OTP verification
        if ($user && $user->phone_number && ! $user->email_verified_at) {
            return redirect()->route('register.otp');
        }

        $submission = null;
        if ($user) {
            $submission = $this->submissionQuery->query([
                'writing_id' => $writing->id,
                'student_id' => $user->id
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

    public function start(StartWritingSubmissionRequest $request, CreateWritingSubmissionAction $action): RedirectResponse
    {
        $attributes = $request->validated();

        $student = $request->user();
        $submission = $this->submissionQuery->query(['writing_id' => $attributes['writing_id'], 'student_id' => $student->id]);

        if ($submission) {
            return redirect()->back()->with('error', 'You have already started this task.');
        }

        $dto = WritingSubmissionDTO::make($attributes, $student->id);

        $action->run($dto);

        return redirect()->back()->with('success', 'Task started! Good luck!');
    }

    public function update(StoreWritingSubmissionRequest $request, UpdateWritingSubmissionAction $action): RedirectResponse
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

        $dto = WritingSubmissionDTO::make($attributes, $student->id);

        $action->run($submission, $dto);

        return redirect()->back();
    }

    public function finish(FinishWritingSubmissionRequest $request, UpdateWritingSubmissionAction $action): RedirectResponse
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

        $dto = WritingSubmissionDTO::make($attributes, $student->id);

        $action->run($submission, $dto);

        return back()->with('success', 'Task completed successfully! Your teacher will review it soon.');
    }
}
