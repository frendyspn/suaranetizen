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
        Schema::create('polling_votes', function (Blueprint $table) {
            $table->id();
            $table->char('id_polling', 36);
            $table->unsignedBigInteger('user_id');
            $table->boolean('nilai');
            $table->timestamps();

            $table->foreign('id_polling')->references('id')->on('pollings')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
