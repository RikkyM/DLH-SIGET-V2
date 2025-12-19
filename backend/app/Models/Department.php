<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    protected $fillable = [
        'nama'
    ];

    public function titikSampah()
    {
        return $this->hasMany(TitikSampah::class, 'id_department');
    }

    public function petugas()
    {
        return $this->hasMany(Petugas::class, 'id_department');
    }

    public function kendaraan()
    {
        return $this->hasMany(DataKendaraan::class, 'id_department');
    }
}
