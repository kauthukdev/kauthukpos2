<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

use Illuminate\Support\Facades\Gate;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        // Implicitly grant "Super Admin" role all permissions
        Gate::before(function ($user, $ability) {
            return $user->hasRole('admin') ? true : null;
        });

        // Dynamically define gates for all permissions
        try {
            foreach (\App\Models\Permission::all() as $permission) {
                Gate::define($permission->permission_code, function ($user) use ($permission) {
                    return $user->hasPermission($permission->permission_code);
                });
            }
        } catch (\Exception $e) {
            // Permissions table might not exist yet (during migration)
        }
    }
}
