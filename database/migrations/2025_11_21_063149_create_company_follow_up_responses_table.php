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
        Schema::create('company_follow_up_responses', function (Blueprint $table) {
            $table->id();
            $table->string('follow_up_response');
            $table->foreignId('company_id')->constrained()->onDelete('cascade');
            $table->longText('meeting_outcome');
            $table->longText('follow_up_notes')->nullable();
            $table->longText('follow_up_reason');   
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('company_follow_up_responses');
    }
};
