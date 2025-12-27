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
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone_number', 15)->unique()->nullable()->after('username');
        });

        Schema::create('telegram_users', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->references('id')->on('users')->cascadeOnDelete();
            $table->unsignedBigInteger('chat_id')->unique();
            $table->string('first_name', 50);
            $table->string('last_name', 50)->nullable();
            $table->string('username', 50)->nullable();
            $table->string('phone_number', 15)->unique()->nullable();
            $table->boolean('is_premium')->default(false);
            $table->string('photo')->nullable();
            $table->date('birthday')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('phone_number');
        });
        Schema::dropIfExists('telegram_users');
    }
};
