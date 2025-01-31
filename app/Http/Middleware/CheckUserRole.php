<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class CheckUserRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Updated to use session() helper

        // Check if the user role_id is 1
        if ($request->user() && Auth::user()->roles->first()->id !== 1) {
            return redirect()->route('dashboard')->with('error', 'You do not have access to this resource.');
        }

        return $next($request);
    }
}
