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
        Schema::create('writing_submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('writing_id')->constrained('writings');
            $table->foreignId('student_id')->constrained('users');
            $table->json('content'); // Fixed: was BIGINT in docs, should be JSON
            $table->time('spent_time');
            $table->timestamp('submitted_at');
            $table->timestamp('evaluated_at')->nullable(); // Fixed typo: was "evaluted_at"
            $table->timestamps();

            // Ensure one submission per student per writing
            $table->unique(['writing_id', 'student_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('writing_submissions');
    }
};
