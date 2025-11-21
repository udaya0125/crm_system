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
        Schema::create('company_meetings', function (Blueprint $table) {
            $table->id();
            $table->date('meeting_date');
            $table->foreignId('company_id')->constrained()->onDelete('cascade'); 
            $table->string('meeting_time');
            $table->string('meeting_type');
            $table->string('meeting_platform');
            $table->string('attendee');          
            $table->longText('agenda');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('company_meetings');
    }
};
