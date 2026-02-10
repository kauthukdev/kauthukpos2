<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user() ? function () use ($request) {
                    $user = $request->user()->load('roles.permissions');
                    return array_merge($user->toArray(), [
                        'role_id' => session('role_id'), // Keep existing just in case
                        'assigned_roles' => $user->roles->pluck('name'),
                        'permissions' => $user->roles->flatMap->permissions->pluck('permission_code')->unique()->values()
                    ]);
                } : null
            ],
            'flash' => [
                'message' => session('message'),
                'error' => session('error'),
                'success' => session('success'),
                'download_url' => session('download_url'),
            ],
        ];
    }
}
