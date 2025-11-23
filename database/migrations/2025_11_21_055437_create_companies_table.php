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
        Schema::create('companies', function (Blueprint $table) {
            $table->id();
            $table->string('company_name');
            $table->string('first_name');
            $table->string('last_name');
            $table->string('client_member')->nullable();
            $table->string('designation');
            $table->string('no_of_rooms')->nullabe();
            $table->string('phone_no');
            $table->string('email');
            $table->string('address');
            $table->string('website');
            $table->string('source')->nullable();
            $table->string('responsible_person');
            $table->string('preffered_message')->nullable();
            $table->string('message_contact')->nullable();
            $table->longText('comment');
            $table->string('follow_up_date')->nullable();
            $table->string('slug');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('companies');
    }
};
