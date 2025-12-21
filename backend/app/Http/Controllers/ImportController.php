<?php

namespace App\Http\Controllers;

use App\Imports\Petugas\KendaraanPetugasImport;
use App\Imports\Petugas\WithNameImport;
use App\Imports\Petugas\WithNikImport;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

class ImportController extends Controller
{
    public function importPetugas()
    {
        return view('import.import-petugas');
    }

    public function importPetugasProcess(Request $request)
    {

        if (!$request->hasFile('file')) {
            return back()->withErrors([
                'file' => 'File belum dipilih'
            ]);
        }

        Excel::import(new WithNameImport, $request->file('file'));
        return back();
    }

    public function kendaraanPetugas()
    {
        return view('import.import-kendaraan-petugas');
    }

    public function kendaraanPetugasProcess(Request $request)
    {
        if (!$request->hasFile('file')) {
            return back()->withErrors([
                'file' => 'File belum dipilih'
            ]);
        }

        Excel::import(new KendaraanPetugasImport, $request->file('file'));
        return back();
    }
}
