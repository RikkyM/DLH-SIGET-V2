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
        Schema::create('petugas', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('old_id')->nullable()->unique();
            $table->unsignedBigInteger('id_department')->nullable()->index();
            $table->unsignedBigInteger('id_penugasan')->nullable()->index();
            $table->unsignedBigInteger('id_kendaraan')->nullable()->index();
            $table->unsignedBigInteger('id_kecamatan')->nullable()->index();
            $table->unsignedBigInteger('id_kelurahan')->nullable()->index();
            $table->string('nik')->nullable()->index();
            $table->string('nama')->index();
            $table->string('nama_jalan')->nullable();
            $table->string('nama_kecamatan')->nullable();
            $table->string('nama_kelurahan')->nullable();
            $table->string('latitude')->nullable();
            $table->string('longitude')->nullable();
            $table->string('panjang_jalur')->nullable();
            $table->text('rute_kerja')->nullable();
            $table->string('armada')->nullable();
            $table->string('no_lambung')->nullable();
            $table->string('jenis_angkutan')->nullable();
            $table->string('foto_petugas')->nullable();
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('petugas');
    }
};
