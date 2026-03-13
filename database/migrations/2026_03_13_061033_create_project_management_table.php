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
        Schema::create('project_management', function (Blueprint $table) {
            $table->id();
            $table->string('project_id')->unique()->nullable();
            $table->string('client_name');
            $table->string('project_title');
            $table->string('service_type');
            $table->date('start_date');  
            $table->date('deadline');
            $table->string('assigned_team')->nullable();
            $table->string('priority');
            $table->string('status');
            $table->string('completion')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('project_management');
    }
};
