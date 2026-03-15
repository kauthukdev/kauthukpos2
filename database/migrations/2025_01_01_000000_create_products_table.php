<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProductsTable extends Migration
{
    public function up()
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('product_code')->unique();
            $table->string('category');
            $table->decimal('selling_price', 10, 2);
            $table->decimal('cost_price', 10, 2);
            $table->boolean('stock')->default(true);
            $table->string('status')->default('active');
            $table->string('image')->nullable();
            $table->string('hsncode')->nullable();
            $table->integer('quantitylimit')->nullable();
            $table->integer('gst')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('products');
    }
} 