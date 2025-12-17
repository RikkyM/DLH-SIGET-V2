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
        Schema::create('data_kendaraan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_jenis')->nullable()->constrained('jenis_kendaraan')->cascadeOnUpdate()->nullOnDelete();
            $table->string('no_plat')->unique();
            $table->string('merk');
            $table->string('lambung')->nullable();
            $table->string('no_rangka')->nullable();
            $table->string('no_mesin')->nullable();
            $table->integer('kapasitas_mesin')->nullable();
            $table->string('warna')->nullable();
            $table->integer('berat')->nullable();
            $table->string('jumlah_kontainer')->nullable();
            $table->string('kondisi')->nullable();
            $table->json('foto_kendaraan')->nullable();
            $table->string('uptd')->nullable();
            $table->text('keterangan')->nullable();
            $table->enum('status', ['aktif', 'nonaktif']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('data_kendaraan');
    }
};
