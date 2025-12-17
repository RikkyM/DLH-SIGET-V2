<?php

namespace App\Http\Controllers;

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
        $request->file('file');

        Excel::import(new WithNikImport, $request->file('file'));

        return back();
    }
}
