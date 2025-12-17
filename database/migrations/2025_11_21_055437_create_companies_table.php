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
            $table->string('full_name');
            $table->string('designation')->nullable();
            $table->string('phone_no');
            $table->string('email');
            $table->text('address')->nullable();
            $table->string('responsible_person')->nullable();
            $table->string('our_team');
            $table->string('client_member');
            $table->longText('comment')->nullable();
            $table->date('follow_up_date')->nullable();
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
