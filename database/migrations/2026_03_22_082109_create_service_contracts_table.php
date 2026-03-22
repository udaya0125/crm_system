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
        Schema::create('service_contracts', function (Blueprint $table) {
            $table->id();
            $table->string('customer_name');
            $table->string('service_type');
            $table->decimal('grand_total', 10, 2);
            $table->string('duration_unit');
            $table->string('duration_value');
            $table->date('expiry_date');
            $table->string('invoice_number');
            $table->date('invoice_date');
            $table->longText('service_names');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('service_contracts');
    }
};
