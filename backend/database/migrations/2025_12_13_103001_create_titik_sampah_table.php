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
        Schema::create('titik_sampah', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_jts')->nullable()->constrained('jenis_titik_sampah')->cascadeOnUpdate()->nullOnDelete();
            $table->foreignId('id_jk')->nullable()->constrained('jenis_kendaraan')->cascadeOnUpdate()->nullOnDelete();
            $table->unsignedBigInteger('id_department')->nullable()->index();
            $table->foreignId('id_kecamatan')->nullable()->constrained('kecamatan')->cascadeOnUpdate()->nullOnDelete();
            $table->foreignId('id_kelurahan')->nullable()->constrained('kelurahan')->cascadeOnUpdate()->nullOnDelete();
            $table->string('armada')->nullable();
            $table->string('nama')->nullable();
            $table->string('nama_jalan')->nullable();
            $table->string('kelurahan')->nullable();
            $table->string('kecamatan')->nullable();
            $table->string('latitude')->nullable();
            $table->string('longitude')->nullable();
            $table->string('vol_sampah')->nullable();
            $table->string('no_lambung')->nullable();
            $table->enum('status_kontainer', ['ada', 'tidak ada', 'bak sampah permanen'])->nullable();
            $table->string('foto_lokasi')->nullable();
            $table->text('rute_kerja')->nullable();
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('titik_sampah');
    }
};
