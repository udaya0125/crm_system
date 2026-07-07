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
        Schema::create('task_assigneds', function (Blueprint $table) {
            $table->id();
            $table->string('task_id')->unique()->nullable();
            $table->string('title');
            $table->string('department');
            $table->string('assigned_team')->nullable();
            $table->string('user_id')->nullable();
            $table->string('priority')->nullable();
            $table->string('start_date')->nullable();
            $table->string('due_date')->nullable();
            $table->longText('description')->nullable();
            $table->string('status')->nullable();
            $table->longText('admin_remarks')->nullable();
            $table->string('admin_status')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('task_assigneds');
    }
};
