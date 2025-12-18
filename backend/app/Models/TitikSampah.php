<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TitikSampah extends Model
{
    protected $table = 'titik_sampah';

    public function department()
    {
        return $this->belongsTo(Department::class, 'id_department');
    }

    public function jenisTitikSampah()
    {
        return $this->belongsTo(JenisTitikSampah::class, 'id_jts');
    }

    public function jenisKendaraan()
    {
        return $this->belongsTo(JenisKendaraan::class, 'id_jk');
    }

    public function kendaraan()
    {
        return $this->belongsTo(DataKendaraan::class, 'armada', 'no_plat');
    }
}
