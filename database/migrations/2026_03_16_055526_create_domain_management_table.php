<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    // public function up(): void
    // {
    //     Schema::create('domain_management', function (Blueprint $table) {
    //         $table->id();
    //         $table->foreignId('client_id')->constrained()->onDelete('cascade');
    //         $table->string('domain_name');
    //         $table->string('register');
    //         $table->date('purchase_date');
    //         $table->date('expiry_date');
    //         $table->string('auto_renewal_status');
    //         $table->string('dns_provider');
    //         $table->timestamps();
    //     });
    // }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('domain_management');
    }
};
