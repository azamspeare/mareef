<?php

use App\Contracts\Enums\SubmissionProcessEnum;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('writings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('teacher_id')->references('id')->on('users')->cascadeOnDelete();
            $table->string('title');
            $table->string('slug');
            $table->json('content');
            $table->time('allocated_time')->nullable();
            $table->timestamp('public_at')->nullable();
            $table->string('hash');
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['teacher_id', 'slug']);
        });

        Schema::create('writing_submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('writing_id')->references('id')->on('writings')->cascadeOnDelete();
            $table->foreignId('student_id')->references('id')->on('users')->cascadeOnDelete();
            $table->json('content');
            $table->time('spent_time');
            $table->timestamp('submitted_at');
            $table->timestamp('evaluated_at')->nullable();
            $table->string('status')->default(SubmissionProcessEnum::IN_PROGRESS->value);
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['writing_id', 'student_id']);
            $table->index(['writing_id', 'submitted_at'], 'writing_submissions_writing_id_submitted_at_index');
        });

        Schema::create('writing_feedbacks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('submission_id')->references('id')->on('writing_submissions')->cascadeOnDelete();
            $table->foreignId('teacher_id')->references('id')->on('users')->cascadeOnDelete();
            $table->json('content');
            $table->decimal('score');
            $table->mediumText('feedback');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('writing_feedbacks');
        Schema::dropIfExists('writing_submissions');
        Schema::dropIfExists('writings');
    }
};
