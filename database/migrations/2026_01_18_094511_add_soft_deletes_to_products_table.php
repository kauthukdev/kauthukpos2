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
        Schema::table('products', function (Blueprint $table) {
            $table->softDeletes();
            $table->unsignedBigInteger('deleted_by')->nullable()->after('deleted_at');
            // Assuming 'status' is akin to active, but user requested 'active', let's stick to user request OR use existing status. 
            // The prompt says "add nessecary flags like... active". 
            // Since 'status' exists and defaults to 'active', I will check if I should add a boolean 'active'.
            // Given the implicit request for explicit flags, I'll add boolean 'is_active' or 'active`.
            // Let's call it 'active' as requested.
            $table->boolean('active')->default(true)->after('deleted_by');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropSoftDeletes();
            $table->dropColumn('deleted_by');
            $table->dropColumn('active');
        });
    }
};
