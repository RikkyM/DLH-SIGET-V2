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
        Schema::table('data_kendaraan', function (Blueprint $table) {
            // $table->foreignId('id_department')->nullable()->after('id_jenis')->constrained('data_kendaraan')->cascadeOnUpdate()->nullOnDelete()->after('id_jenis');
            $table->after('id_jenis', function (Blueprint $table) {
                $table->foreignId('id_department')->nullable()->after('id_jenis')->constrained('data_kendaraan')->cascadeOnUpdate()->nullOnDelete();
            });
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('data_kendaraan', function (Blueprint $table) {
            $table->dropForeign(['id_department']);
            $table->dropColumn('id_department');
        });
    }
};
