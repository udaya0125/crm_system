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
        Schema::table('project_management', function (Blueprint $table) {
            //
            $table->longText('user_remarks')->nullable()->after('status');
            $table->longText('admin_remarks')->nullable()->after('user_remarks');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('project_management', function (Blueprint $table) {
            //
            $table->dropColumn('user_remarks');
            $table->dropColumn('admin_remarks');
        });
    }
};
