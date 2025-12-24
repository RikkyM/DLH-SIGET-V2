<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Penugasan extends Model
{
    protected $table = 'penugasan';

    protected $fillable = [
        'icon',
        'nama'
    ];

    public function petugas()
    {
        return $this->hasMany(Petugas::class, 'id_penugasan');
    }
}

