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
        Schema::create('banners', function (Blueprint $t) {
            $t->id();
            $t->string('title')->nullable();
            $t->string('image_path');
            $t->string('link')->nullable();
            $t->boolean('is_active')->default(false);  // default: non‑aktif
            $t->unsignedInteger('sort_order')->default(0);
            $t->timestamps();
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
