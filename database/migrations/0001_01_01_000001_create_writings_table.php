<?php

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
            $table->string('slug')->unique();
            $table->json('content');
            $table->time('allocated_time')->nullable();
            $table->timestamp('public_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('writing_submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('writing_id')->references('id')->on('writings')->cascadeOnDelete();
            $table->foreignId('student_id')->references('id')->on('users')->cascadeOnDelete();
            $table->json('content');
            $table->time('spent_time');
            $table->timestamp('submitted_at');
            $table->timestamp('evaluated_at')->nullable();
            $table->timestamps();

            $table->unique(['writing_id', 'student_id']);
        });

        Schema::create('writing_feedbacks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('submission_id')->references('id')->on('writing_submissions')->cascadeOnDelete();
            $table->foreignId('teacher_id')->references('id')->on('users')->cascadeOnDelete();
            $table->json('content');
            $table->decimal('score');
            $table->mediumText('feedback');
            $table->timestamps();
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
