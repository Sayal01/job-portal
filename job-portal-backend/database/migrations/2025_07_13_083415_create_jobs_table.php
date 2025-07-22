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
        Schema::create('jobs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->onDelete('cascade');
            $table->string('title');
            $table->text('description')->nullable();
            $table->foreignId('department_id')->nullable()->constrained('departments')->onDelete('set null');
            $table->string('location')->nullable();
            $table->enum('type', ['full-time', 'part-time', 'internship']);
            $table->string('experience_level')->nullable();
            $table->string('salary_min')->nullable();
            $table->string('salary_max')->nullable();

            // Store arrays as JSON columns
            $table->json('responsibilities')->nullable();
            $table->json('requirements')->nullable();
            $table->json('qualifications')->nullable();
            $table->json('skills')->nullable();

            $table->date('application_deadline')->nullable();
            $table->date('start_date')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jobs');
    }
};
