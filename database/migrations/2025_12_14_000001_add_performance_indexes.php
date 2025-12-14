<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * These indexes optimize queries for high-traffic scenarios (500+ RPS)
     */
    public function up(): void
    {
        // Add index for filtering submissions by evaluation status
        Schema::table('writing_submissions', function (Blueprint $table) {
            $table->index('evaluated_at', 'writing_submissions_evaluated_at_index');
            $table->index('status', 'writing_submissions_status_index');
            $table->index('student_id', 'writing_submissions_student_id_index');
        });

        // Add index for filtering writings by teacher (improves JOIN performance)
        Schema::table('writings', function (Blueprint $table) {
            $table->index('teacher_id', 'writings_teacher_id_index');
        });

        // Add index for user role filtering
        Schema::table('users', function (Blueprint $table) {
            $table->index('role', 'users_role_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('writing_submissions', function (Blueprint $table) {
            $table->dropIndex('writing_submissions_evaluated_at_index');
            $table->dropIndex('writing_submissions_status_index');
            $table->dropIndex('writing_submissions_student_id_index');
        });

        Schema::table('writings', function (Blueprint $table) {
            $table->dropIndex('writings_teacher_id_index');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex('users_role_index');
        });
    }
};
