<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JenisTitikSampah extends Model
{
    protected $table = 'jenis_titik_sampah';

    protected $fillable = [
        'nama'
    ];

    public function titikSampah()
    {
        return $this->hasMany(TitikSampah::class, 'id_jts');
    }
}
