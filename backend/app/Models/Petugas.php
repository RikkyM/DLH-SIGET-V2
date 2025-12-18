<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Petugas extends Model
{
    protected $table = 'petugas';

    protected $fillable = [
        'id_department',
        'id_penugasan',
        'id_kendaraan',
        'id_kecamatan',
        'id_kelurahan',
        'nik',
        'nama',
        'nama_jalan',
        'nama_kecamatan',
        'nama_kelurahan',
        'latitude',
        'longitude',
        'panjang_jalur',
        'rute_kerja',
        'armada',
        'no_lambung',
        'jenis_angkutan',
        'foto_petugas',
        'keterangan'
    ];

    public function department()
    {
        return $this->belongsTo(Department::class, 'id_department');
    }

    public function penugasan()
    {
        return $this->belongsTo(Penugasan::class, 'id_penugasan');
    }

    public function kendaraan()
    {
        return $this->belongsTo(DataKendaraan::class, 'id_kendaraan');
    }
}
