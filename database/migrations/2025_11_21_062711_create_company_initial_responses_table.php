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
        Schema::create('company_initial_responses', function (Blueprint $table) {
            $table->id();
            $table->string('initial_response');
            $table->foreignId('company_id')->constrained()->onDelete('cascade'); 
            $table->longText('meeting_outcome');
            $table->longText('initial_notes')->nullable();
            $table->longText('initial_reason')->nullable(); 
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('company_initial_responses');
    }
};
