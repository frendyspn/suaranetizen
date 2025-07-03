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
        Schema::create('donasis', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('nama_donasi');
            $table->decimal('target', 15, 2);
            $table->boolean('is_active')->default(true);
            $table->enum('status', ['new', 'onprogress', 'finish', 'reject'])->default('new');
            $table->date('expired_date');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('donasis');
    }
};
