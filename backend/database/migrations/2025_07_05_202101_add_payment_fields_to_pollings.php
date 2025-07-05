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
        Schema::table('pollings', function (Blueprint $table) {
            $table->unsignedBigInteger('nominal')->nullable();
            $table->string('id_payment')->nullable();
            $table->string('qris_url')->nullable();
            $table->text('payment_response')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pollings', function (Blueprint $table) {
            //
        });
    }
};
