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
        Schema::create('profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');

            $table->text('bio')->nullable();

            $table->json('skills')->nullable(); // ✅ JSON instead of text
            $table->json('education')->nullable(); // ✅ JSON instead of text
            $table->json('work_experience')->nullable(); // ✅ JSON instead of text

            $table->string('resume_file')->nullable(); // ✅ keep for uploaded file path

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('profiles');
    }
};
