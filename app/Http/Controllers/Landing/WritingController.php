<?php

declare(strict_types=1);

namespace App\Http\Controllers\Landing;

use App\Contracts\Enums\SubmissionProcessEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\Submission\StoreSubmissionRequest;
use App\Models\Submission\WritingSubmission;
use App\Queries\Submission\SubmissionFindByWritingAndStudentIDQuery;
use App\Queries\User\TeacherFindByUsernameQuery;
use App\Queries\Writing\WritingFindBySlugQuery;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class WritingController extends Controller
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

        // Check if the authenticated user has an existing submission
        $submission = null;
        if ($request->user()) {
            $submission = $this->submissionQuery->query([
                'writing_id' => $writing->id,
                'student_id' => $request->user()->id
            ]);
        }

        return Inertia::render('WritingTask', [
            'writing' => $writing,
            'submission' => $submission,
        ]);
    }

    /**
     * Start the writing task - creates a new submission with IN_PROGRESS status
     */
    public function start(Request $request): RedirectResponse
    {
        $request->validate([
            'writing_id' => ['required', 'integer', 'exists:writings,id'],
        ]);

        $student = $request->user();
        $writingId = $request->input('writing_id');

        // Check if submission already exists
        $existingSubmission = $this->submissionQuery->query([
            'writing_id' => $writingId,
            'student_id' => $student->id
        ]);

        if ($existingSubmission) {
            return back()->with('error', 'You have already started this task.');
        }

        // Create new submission with IN_PROGRESS status
        WritingSubmission::create([
            'writing_id' => $writingId,
            'student_id' => $student->id,
            'content' => [],
            'spent_time' => '00:00:00',
            'submitted_at' => now(),
            'status' => SubmissionProcessEnum::IN_PROGRESS->value,
        ]);

        return back()->with('success', 'Task started! Good luck!');
    }

    /**
     * Auto-save or manual save - updates submission content
     */
    public function store(StoreSubmissionRequest $request): RedirectResponse
    {
        $student = $request->user();
        $attributes = $request->validated();

        $submission = $this->submissionQuery->query([
            'writing_id' => $attributes['writing_id'],
            'student_id' => $student->id
        ]);

        if (!$submission) {
            return back()->with('error', 'Please start the task first before submitting.');
        }

        if ($submission->status !== SubmissionProcessEnum::IN_PROGRESS->value) {
            return back()->with('error', 'This task has already been completed.');
        }

        // Decode JSON string to array for proper storage
        $content = $attributes['content'];
        if (is_string($content)) {
            $content = json_decode($content, true);
        }

        // Update submission content
        $submission->update([
            'content' => $content,
        ]);

        return back()->with('success', 'Your work has been saved successfully.');
    }

    /**
     * Finish the writing task - marks submission as COMPLETED
     */
    public function finish(Request $request): RedirectResponse
    {
        $request->validate([
            'writing_id' => ['required', 'integer', 'exists:writings,id'],
            'content' => ['required', 'string'],
            'spent_time' => ['required', 'string'], // Format: HH:MM:SS
        ]);

        $student = $request->user();
        $writingId = $request->input('writing_id');

        $submission = $this->submissionQuery->query([
            'writing_id' => $writingId,
            'student_id' => $student->id
        ]);

        if (!$submission) {
            return back()->with('error', 'No active submission found.');
        }

        if ($submission->status !== SubmissionProcessEnum::IN_PROGRESS->value) {
            return back()->with('error', 'This task has already been completed.');
        }

        // Update submission with final content and mark as completed
        $content = $request->input('content');
        // Decode JSON string to array for proper storage
        if (is_string($content)) {
            $content = json_decode($content, true);
        }

        $submission->update([
            'content' => $content,
            'spent_time' => $request->input('spent_time'),
            'submitted_at' => now(),
            'status' => SubmissionProcessEnum::COMPLETED->value,
        ]);

        return back()->with('success', 'Task completed successfully! Your teacher will review it soon.');
    }
}
