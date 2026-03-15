<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ShareUserData
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Share user data with views
        view()->share('auth', [
            'user' => $request->user() ? array_merge($request->user()->toArray(), ['role_id' => session('role_id')]) : null,
        ]);

        return $next($request);
    }
}
