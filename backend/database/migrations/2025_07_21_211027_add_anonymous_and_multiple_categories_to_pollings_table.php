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
            $table->boolean('is_anonymous')->default(false)->after('kalimat');
            $table->json('kategori_ids')->nullable()->after('kategori_id'); // Store multiple category IDs
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pollings', function (Blueprint $table) {
            $table->dropColumn(['is_anonymous', 'kategori_ids']);
        });
    }
};
