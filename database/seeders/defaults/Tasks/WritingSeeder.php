<?php

declare(strict_types=1);

namespace Database\Seeders\defaults\Tasks;

use App\Contracts\Enums\RoleEnum;
use App\Models\Feedback\WritingFeedback;
use App\Models\Submission\Writing\WritingSubmission;
use App\Models\User\User;
use App\Models\Writing\Writing;
use Illuminate\Database\Seeder;

final class WritingSeeder extends Seeder
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
            // Create 2 writing tasks for each teacher
            Writing::factory()
                ->count(15)
                ->create(['teacher_id' => $teacher->id])
                ->each(function (Writing $writing) use ($students, $teacher) {
                    // Create 3-7 submissions for each writing task
                    $submissionCount = fake()->numberBetween(10, 20);
                    $selectedStudents = $students->random(min($submissionCount, $students->count()));

                    $submissions = [];
                    /** @var User $student */
                    foreach ($selectedStudents as $student) {
                        $submissions[] = WritingSubmission::factory()->create([
                            'writing_id' => $writing->id,
                            'student_id' => $student->id,
                        ]);
                    }

                    // Create feedbacks for half of the submissions
                    $feedbackCount = (int) ceil(count($submissions) / 2);
                    $submissionsForFeedback = fake()->randomElements($submissions, $feedbackCount);

                    foreach ($submissionsForFeedback as $submission) {
                        WritingFeedback::factory()->create([
                            'submission_id' => $submission->id,
                            'teacher_id' => $teacher->id,
                        ]);
                    }
                });
        }
    }
}
