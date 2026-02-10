<?php

use App\Models\User;
use App\Models\Role;
use App\Models\Permission;

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "Verifying Permissions...\n";

// Check Permissions
$permCount = Permission::count();
echo "Total Permissions: $permCount\n";

// Check Roles
$admin = Role::where('slug', 'admin')->first();
$billing = Role::where('slug', 'billing-user')->first();
$supervisor = Role::where('slug', 'supervisor')->first();

echo "Admin Permissions: " . $admin->permissions->count() . "\n";
echo "Billing Permissions: " . $billing->permissions->count() . "\n";
echo "Supervisor Permissions: " . $supervisor->permissions->count() . "\n";

// Check User Logic (Mocking check)
// Assuming user 1 is admin
$user = User::find(1);
if ($user) {
    echo "User 1 ({$user->name}) has 'INVOICE_CREATE': " . ($user->hasPermission('INVOICE_CREATE') ? 'Yes' : 'No') . "\n";
    echo "User 1 hasRole 'admin': " . ($user->hasRole('admin') ? 'Yes' : 'No') . "\n";
} else {
    echo "User 1 not found.\n";
}

echo "Verification Complete.\n";
