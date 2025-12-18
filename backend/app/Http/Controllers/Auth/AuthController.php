<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $validated = $request->validate([
            'username' => 'required',
            'password' => 'required'
        ]);

        try {
            if (Auth::attempt($validated)) {
                $request->session()->regenerate();

                return response()->json([
                    'message' => 'success',
                ], 200);

                return response()->json([
                    'message' => 'Username atau password yang Anda masukkan salah.'
                ], 401);
            }
        } catch (\Exception $e) {
            return response()->json([
                'message' => "Terjadi kesalahan pada server."
            ], 500);
        }
    }
}
