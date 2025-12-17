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
            $table->foreignId('id_kecamatan')->nullable()->constrained('kecamatan')->cascadeOnUpdate()->nullOnDelete();
            $table->foreignId('id_kelurahan')->nullable()->constrained('kelurahan')->cascadeOnUpdate()->nullOnDelete();
            $table->string('armada')->nullable();
            $table->string('nama');
            $table->string('nama_jalan');
            $table->string('kelurahan');
            $table->string('kecamatan');
            $table->string('latitude');
            $table->string('longitude');
            $table->string('vol_sampah');
            $table->string('no_lambung');
            $table->enum('status_kontainer', ['ada', 'tidak ada', 'bak sampah permanen']);
            $table->string('foto_lokasi');
            $table->text('rute_kerja')->nullable();
            $table->text('keterangan')->nullable();
            $table->timestamps();

            $table->foreign('armada')
                ->references('no_plat')
                ->on('data_kendaraan')
                ->cascadeOnUpdate()
                ->nullOnDelete();
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
