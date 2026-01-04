<?php

declare(strict_types=1);

namespace App\Http\Controllers\Student;

use App\Actions\Submission\Quiz\CreateQuizSubmissionAction;
use App\Actions\Submission\Quiz\SaveQuizAnswersAction;
use App\Contracts\Enums\SubmissionProcessEnum;
use App\DTOs\Quiz\QuizAnswerDTO;
use App\DTOs\Quiz\QuizSubmissionDTO;
use App\Handlers\ServiceHandler;
use App\Http\Controllers\Controller;
use App\Http\Requests\Student\Quiz\FinishQuizSubmissionRequest;
use App\Http\Requests\Student\Quiz\SaveQuizSubmissionRequest;
use App\Http\Requests\Student\Quiz\StartQuizSubmissionRequest;
use App\Models\QuizOption\QuizOption;
use App\Queries\Quiz\QuizFindBySlugQuery;
use App\Queries\Quiz\QuizSubmissionFindByStudentIDQuery;
use App\Queries\User\TeacherFindByUsernameQuery;
use App\Services\Quiz\GradeQuizSubmissionService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class QuizTaskController extends Controller
{
    public function __construct(
        protected TeacherFindByUsernameQuery $teacherQuery,
        protected QuizFindBySlugQuery $quizQuery,
        protected QuizSubmissionFindByStudentIDQuery $submissionQuery,
    ) {
    }

    public function create(Request $request, string $handle, string $slug): Response|RedirectResponse
    {
        $teacher = $this->teacherQuery->query(['username' => $handle]);
        if (! $teacher) {
            abort(404);
        }

        $quiz = $this->quizQuery->query(['slug' => $slug, 'teacher_id' => $teacher->id]);
        if (! $quiz) {
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
                'quiz_id' => $quiz->id,
                'student_id' => $user->id
            ]);
        }

        $quiz->load([
            'questions' => function ($query) {
                $query->orderBy('order');
            },
            'questions.options' => function ($query) {
                $query->select('id', 'question_id', 'content', 'order')->orderBy('order');
            }
        ]);

        $submissionData = null;
        $isCompleted = $submission && SubmissionProcessEnum::isCompleted($submission->status);

        if ($submission) {
            $submission->load('answers');
            $submissionData = $submission->toArray();

            if ($isCompleted) {
                $correctOptionsMap = QuizOption::query()
                    ->whereIn('question_id', $quiz->questions->pluck('id'))
                    ->where('is_correct', true)
                    ->get()
                    ->groupBy('question_id')
                    ->map(fn ($options) => $options->pluck('id')->toArray())
                    ->toArray();

                $submissionData['answers'] = collect($submissionData['answers'])->map(function ($answer) use ($correctOptionsMap) {
                    $answer['correct_options'] = $correctOptionsMap[$answer['question_id']] ?? [];
                    return $answer;
                })->toArray();
            }
        }

        return Inertia::render('Student/QuizTask', [
            'quiz' => $quiz,
            'submission' => $submissionData,
            'seo' => [
                'title' => $quiz->title . ' - Quiz Task',
                'description' => 'Complete your quiz task on Mareef.',
                'image' => '/images/og/quiz-task.png',
            ],
        ]);
    }

    public function start(StartQuizSubmissionRequest $request, CreateQuizSubmissionAction $action): RedirectResponse
    {
        $attributes = $request->validated();

        $student = $request->user();
        $submission = $this->submissionQuery->query(['quiz_id' => $attributes['quiz_id'], 'student_id' => $student->id]);

        if ($submission) {
            return redirect()->back()->with('error', 'You have already started this quiz.');
        }

        $dto = QuizSubmissionDTO::make($attributes, $student->id);

        $action->run($dto);

        return redirect()->back()->with('success', 'Quiz started! Good luck!');
    }

    public function update(SaveQuizSubmissionRequest $request, SaveQuizAnswersAction $action): RedirectResponse
    {
        $student = $request->user();
        $attributes = $request->validated();

        $submission = $this->submissionQuery->query(['quiz_id' => $attributes['quiz_id'], 'student_id' => $student->id]);

        if (! $submission) {
            return redirect()->back()->with('error', 'Please start the quiz first before submitting.');
        }

        if (! SubmissionProcessEnum::isInProgress($submission->status)) {
            return redirect()->back()->with('error', 'This quiz has already been completed.');
        }

        $answerDTOs = QuizAnswerDTO::collection($submission->id, $attributes['answers']);

        $action->run($answerDTOs);

        return redirect()->back();
    }

    public function finish(FinishQuizSubmissionRequest $request, ServiceHandler $handler): RedirectResponse
    {
        $student = $request->user();
        $attributes = $request->validated();

        $submission = $this->submissionQuery->query(['quiz_id' => $attributes['quiz_id'], 'student_id' => $student->id]);

        if (! $submission) {
            return back()->with('error', 'No active submission found.');
        }

        if (! SubmissionProcessEnum::isInProgress($submission->status)) {
            return back()->with('error', 'This quiz has already been completed.');
        }

        $result = $handler->handle(new GradeQuizSubmissionService($submission, $attributes['answers'], $attributes['spent_time']));

        if (! $result) {
            return back()->with('error', 'Failed to grade quiz submission.');
        }

        return back()->with('success', 'Quiz completed! Your score: ' . $result['data']['score']);
    }
}
