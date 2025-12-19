<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DataKendaraan extends Model
{
    protected $table = 'data_kendaraan';

    protected $fillable = [
        'id_jenis',
        'no_plat',
        'merk',
        'lambung',
        'no_rangka',
        'no_mesin',
        'kapasitas_mesin',
        'warna',
        'berat',
        'jumlah_kontainer',
        'kondisi',
        'foto_kendaraan',
        'uptd',
        'keterangan',
        'status'
    ];

    public function jenisKendaraan()
    {
        return $this->belongsTo(JenisKendaraan::class, 'id_jenis', 'id');
    }

    public function titikSampah()
    {
        return $this->hasMany(TitikSampah::class, 'armada', 'no_plat');
    }

    public function department()
    {
        return $this->belongsTo(Department::class, 'id_department');
    }
}
