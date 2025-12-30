<?php

use App\Contracts\Enums\QuizTypeEnum;
use App\Contracts\Enums\SubmissionProcessEnum;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('quizzes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('teacher_id')->references('id')->on('users')->cascadeOnDelete();
            $table->string('title');
            $table->string('slug');
            $table->mediumText('description')->nullable();
            $table->time('allocated_time')->nullable();
            $table->timestamp('public_at')->nullable();
            $table->string('hash');
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('quiz_questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('quiz_id')->references('id')->on('quizzes')->cascadeOnDelete();
            $table->string('type', 30);
            $table->string('content');
            $table->unsignedInteger('order');
            $table->unsignedInteger('point')->default(1);
            $table->timestamps();
        });

        Schema::create('quiz_options', function (Blueprint $table) {
            $table->id();
            $table->foreignId('question_id')->references('id')->on('quiz_questions')->cascadeOnDelete();
            $table->mediumText('content');
            $table->boolean('is_correct')->default(false);
            $table->unsignedInteger('order');
            $table->timestamps();
        });

        Schema::create('quiz_submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('quiz_id')->references('id')->on('quizzes')->cascadeOnDelete();
            $table->foreignId('student_id')->references('id')->on('users')->cascadeOnDelete();
            $table->unsignedInteger('score')->nullable();
            $table->time('spent_time')->nullable();
            $table->timestamp('submitted_at')->nullable();
            $table->string('status')->default(SubmissionProcessEnum::IN_PROGRESS->value);
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('quiz_answers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('submission_id')->references('id')->on('quiz_submissions')->cascadeOnDelete();
            $table->foreignId('question_id')->references('id')->on('quiz_questions')->cascadeOnDelete();
            $table->json('options');
            $table->boolean('is_correct')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quiz_answers');
        Schema::dropIfExists('quiz_submissions');
        Schema::dropIfExists('quiz_options');
        Schema::dropIfExists('quiz_questions');
        Schema::dropIfExists('quizzes');
    }
};
