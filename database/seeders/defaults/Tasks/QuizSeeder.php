<?php

declare(strict_types=1);

namespace Database\Seeders\defaults\Tasks;

use App\Contracts\Enums\QuizTypeEnum;
use App\Contracts\Enums\RoleEnum;
use App\Models\Quiz\Quiz;
use App\Models\QuizAnswer\QuizAnswer;
use App\Models\QuizOption\QuizOption;
use App\Models\QuizQuestion\QuizQuestion;
use App\Models\Submission\Quiz\QuizSubmission;
use App\Models\User\User;
use Illuminate\Database\Seeder;

final class QuizSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $teachers = User::query()->where('role', RoleEnum::TEACHER->value)->get();
        $students = User::query()->where('role', RoleEnum::STUDENT->value)->get();

        /** @var User $teacher */
        foreach ($teachers as $teacher) {
            // Create 5-10 quizzes for each teacher
            Quiz::factory()
                ->count(fake()->numberBetween(5, 10))
                ->create(['teacher_id' => $teacher->id])
                ->each(function (Quiz $quiz) use ($students) {
                    // Create 5-15 questions for each quiz
                    $questionCount = fake()->numberBetween(5, 15);

                    for ($q = 1; $q <= $questionCount; $q++) {
                        $questionType = fake()->randomElement(QuizTypeEnum::cases());

                        /** @var QuizQuestion $question */
                        $question = QuizQuestion::factory()->create([
                            'quiz_id' => $quiz->id,
                            'type' => $questionType->value,
                            'order' => $q,
                        ]);

                        // Create options based on question type
                        $this->createOptionsForQuestion($question, $questionType);
                    }

                    // Create 5-15 submissions for each quiz from random students
                    $submissionCount = fake()->numberBetween(5, 15);
                    $selectedStudents = $students->random(min($submissionCount, $students->count()));

                    /** @var User $student */
                    foreach ($selectedStudents as $student) {
                        // 70% completed, 30% in progress
                        $isCompleted = fake()->boolean(70);

                        /** @var QuizSubmission $submission */
                        $submission = QuizSubmission::factory()
                            ->{$isCompleted ? 'completed' : 'inProgress'}()
                            ->create([
                                'quiz_id' => $quiz->id,
                                'student_id' => $student->id,
                            ]);

                        // Create answers for completed submissions
                        if ($isCompleted) {
                            $this->createAnswersForSubmission($submission, $quiz);
                        }
                    }
                });
        }
    }

    /**
     * Create options for a question based on its type.
     */
    private function createOptionsForQuestion(QuizQuestion $question, QuizTypeEnum $type): void
    {
        match ($type) {
            QuizTypeEnum::SINGLE_CHOICE, QuizTypeEnum::MULTIPLE_CHOICE => $this->createChoiceOptions($question, $type),
            QuizTypeEnum::TRUE_FALSE => $this->createTrueFalseOptions($question),
            QuizTypeEnum::SHORT_ANSWER, QuizTypeEnum::LONG_ANSWER => null, // No predefined options for text answers
        };
    }

    /**
     * Create choice options (single or multiple).
     */
    private function createChoiceOptions(QuizQuestion $question, QuizTypeEnum $type): void
    {
        $optionCount = fake()->numberBetween(3, 5);

        if ($type === QuizTypeEnum::SINGLE_CHOICE) {
            $correctOptionIndex = fake()->numberBetween(1, $optionCount);

            for ($o = 1; $o <= $optionCount; $o++) {
                QuizOption::factory()->create([
                    'question_id' => $question->id,
                    'is_correct' => $o === $correctOptionIndex,
                    'order' => $o,
                ]);
            }
        } else {
            // Multiple choice - randomly select 1 to n-1 correct options
            $correctOptions = fake()->randomElements(
                range(1, $optionCount),
                fake()->numberBetween(1, max(1, $optionCount - 1))
            );

            for ($o = 1; $o <= $optionCount; $o++) {
                QuizOption::factory()->create([
                    'question_id' => $question->id,
                    'is_correct' => in_array($o, $correctOptions),
                    'order' => $o,
                ]);
            }
        }
    }

    /**
     * Create true/false options.
     */
    private function createTrueFalseOptions(QuizQuestion $question): void
    {
        $correctAnswer = fake()->boolean();

        QuizOption::factory()->create([
            'question_id' => $question->id,
            'content' => 'True',
            'is_correct' => $correctAnswer,
            'order' => 1,
        ]);

        QuizOption::factory()->create([
            'question_id' => $question->id,
            'content' => 'False',
            'is_correct' => !$correctAnswer,
            'order' => 2,
        ]);
    }

    /**
     * Create answers for a completed submission.
     */
    private function createAnswersForSubmission(QuizSubmission $submission, Quiz $quiz): void
    {
        $questions = $quiz->questions()->with('options')->get();

        /** @var QuizQuestion $question */
        foreach ($questions as $question) {
            $questionType = QuizTypeEnum::tryFrom($question->type);
            $options = $question->options;

            // For text-based questions, skip option selection
            if (in_array($questionType, [QuizTypeEnum::SHORT_ANSWER, QuizTypeEnum::LONG_ANSWER])) {
                // For text answers, randomly mark as correct/incorrect (teacher would grade these)
                QuizAnswer::factory()->create([
                    'submission_id' => $submission->id,
                    'question_id' => $question->id,
                    'options' => [],
                    'is_correct' => fake()->boolean(70),
                ]);
                continue;
            }

            $correctOptions = $options->where('is_correct', true)->pluck('id')->toArray();

            // Simulate student selecting options (70% chance of correct answer)
            $isAnswerCorrect = fake()->boolean(70);

            if ($isAnswerCorrect) {
                $selectedOptions = $correctOptions;
            } else {
                // Select random wrong options
                $wrongOptions = $options->where('is_correct', false)->pluck('id')->toArray();
                $selectedOptions = !empty($wrongOptions)
                    ? [fake()->randomElement($wrongOptions)]
                    : $correctOptions;
            }

            QuizAnswer::factory()->create([
                'submission_id' => $submission->id,
                'question_id' => $question->id,
                'options' => $selectedOptions,
                'is_correct' => $isAnswerCorrect,
            ]);
        }

        // Update submission score based on correct answers
        $totalPoints = $questions->sum('point');
        $earnedPoints = $questions->filter(function ($q) use ($submission) {
            $answer = $submission->answers()->where('question_id', $q->id)->first();
            return $answer && $answer->is_correct;
        })->sum('point');

        $score = $totalPoints > 0 ? (int) round(($earnedPoints / $totalPoints) * 100) : 0;
        $submission->update(['score' => $score]);
    }
}
