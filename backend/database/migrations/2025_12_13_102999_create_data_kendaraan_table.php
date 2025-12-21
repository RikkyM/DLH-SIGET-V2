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
            $table->unsignedBigInteger('id_jenis')->nullable()->index();
            $table->unsignedBigInteger('id_department')->nullable()->index();
            $table->unsignedBigInteger('id_petugas')->nullable()->index();
            $table->string('no_plat');
            $table->string('merk');
            $table->string('lambung_lama')->nullable();
            $table->string('lambung_baru')->nullable();
            $table->string('no_rangka')->nullable();
            $table->string('no_mesin')->nullable();
            $table->string('no_stnk')->nullable();
            $table->string('tahun_pembuatan')->nullable();
            $table->integer('kapasitas_mesin')->nullable();
            $table->string('warna')->nullable();
            $table->integer('berat')->nullable();
            $table->string('jumlah_kontainer')->nullable();
            $table->string('kondisi')->nullable();
            $table->json('foto_kendaraan')->nullable();
            $table->string('uptd')->nullable();
            $table->string('nama_sopir')->nullable();
            $table->text('keterangan')->nullable();
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
