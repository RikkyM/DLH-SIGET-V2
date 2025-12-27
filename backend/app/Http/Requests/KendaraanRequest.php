<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class KendaraanRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    private function req(): string
    {
        return $this->isMethod('post') ? 'required' : 'nullable';
    }

    private function fotoRule(string $field): string
    {
        $base = 'image|mimes:jpg,jpeg,png,webp|max:2048';

        if ($this->isMethod('post')) {
            return 'required|' . $base;
        }

        $others = collect(['foto_depan', 'foto_belakang', 'foto_kanan', 'foto_kiri'])
            ->reject(fn($f) => $f === $field)
            ->implode(',');

        return "sometimes|required_with:{$others}|{$base}";
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'id_jenis' => $this->req() . '|numeric|exists:jenis_kendaraan,id',
            'id_department' => $this->req() . '|numeric|exists:departments,id',
            'id_petugas' => $this->req() . '|numeric|exists:petugas,id',
            'no_plat' => $this->req() . '|string|max:10',
            'merk' => $this->req() . '|string|max:40',
            'lambung_baru' => $this->req() . '|string|max:25',
            'no_rangka' => $this->req() . '|string|max:25',
            'no_mesin' => $this->req() . '|string|max:25',
            'no_stnk' => $this->req() . '|string|max:25',
            'tahun_pembuatan' => $this->req() . '|numeric|digits:4|min:2000|max:' . date('Y'),
            'kapasitas_mesin' => $this->req() . '|numeric|min:1',
            'warna' => $this->req() . '|string|max:15',
            'berat' => $this->req() . '|numeric|min:1',
            'jumlah_kontainer' => $this->req() . '|string|max:10',
            'kondisi' => $this->req() . '|string|in:BAIK,RUSAK RINGAN,RUSAK BERAT',
            'keterangan' => 'string|max:255',
            'foto_depan' => $this->fotoRule('foto_depan'),
            'foto_belakang' => $this->fotoRule('foto_belakang'),
            'foto_kanan' => $this->fotoRule('foto_kanan'),
            'foto_kiri' => $this->fotoRule('foto_kiri')
        ];
    }

    public function messages(): array
    {
        return [
            'id_jenis.numeric' => 'Jenis kendaraan tidak ada',
            'id_jenis.exists' => 'Jenis kendaraan tidak ditemukan'
        ];
    }
}
