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
        Schema::create('sales', function (Blueprint $table) {
            $table->id();
            $table->string('invoice_no')->unique();
            $table->date('invoice_date');
            $table->string('buyer_name');
            $table->text('buyer_address')->nullable();
            $table->string('buyer_gstin')->nullable();
            $table->string('delivery_note')->nullable();
            $table->string('mode_terms_of_payment')->nullable();
            $table->string('supplier_reference')->nullable();
            $table->string('other_reference')->nullable();
            $table->decimal('grand_total', 10, 2)->default(0);
            $table->decimal('total_tax', 10, 2)->default(0);
            $table->decimal('taxable_value', 10, 2)->default(0);
            $table->string('amount_chargeable_in_words')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sales');
    }
}; 