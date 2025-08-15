<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('job_interviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('application_id')->constrained()->onDelete('cascade');
            $table->unsignedInteger('round_number'); // 1, 2, 3...
            $table->enum('status', ['scheduled', 'completed', 'passed', 'failed'])->default('scheduled');
            $table->timestamp('scheduled_at')->nullable();
            $table->string('interviewer_name')->nullable();
            $table->text('remarks')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('job_interviews');
    }
};
