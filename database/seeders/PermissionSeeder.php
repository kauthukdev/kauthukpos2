<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Define permissions
        $permissions = [
            // User Module
            ['permission_code' => 'USER_CREATE', 'permission_name' => 'Create User', 'module' => 'USER'],
            ['permission_code' => 'USER_EDIT', 'permission_name' => 'Edit User', 'module' => 'USER'],
            ['permission_code' => 'USER_DELETE', 'permission_name' => 'Delete User', 'module' => 'USER'],
            ['permission_code' => 'USER_VIEW', 'permission_name' => 'View User', 'module' => 'USER'],
            
            // Invoice Module
            ['permission_code' => 'INVOICE_CREATE', 'permission_name' => 'Create Invoice', 'module' => 'INVOICE'],
            ['permission_code' => 'INVOICE_EDIT', 'permission_name' => 'Edit Invoice', 'module' => 'INVOICE'],
            ['permission_code' => 'INVOICE_DELETE', 'permission_name' => 'Delete Invoice', 'module' => 'INVOICE'],
            ['permission_code' => 'INVOICE_VIEW', 'permission_name' => 'View Invoice', 'module' => 'INVOICE'],

            // Product Module
            ['permission_code' => 'PRODUCT_CREATE', 'permission_name' => 'Create Product', 'module' => 'PRODUCT'],
            ['permission_code' => 'PRODUCT_EDIT', 'permission_name' => 'Edit Product', 'module' => 'PRODUCT'],
            ['permission_code' => 'PRODUCT_DELETE', 'permission_name' => 'Delete Product', 'module' => 'PRODUCT'],
            ['permission_code' => 'PRODUCT_VIEW', 'permission_name' => 'View Product', 'module' => 'PRODUCT'],

            // Settings Module
            ['permission_code' => 'SETTINGS_MANAGE', 'permission_name' => 'Manage Settings', 'module' => 'SETTINGS'],
        ];

        // Create Permissions
        foreach ($permissions as $permission) {
            Permission::firstOrCreate(
                ['permission_code' => $permission['permission_code']],
                $permission
            );
        }

        // Assign Permissions to Roles

        // Admin (All Permissions)
        $adminRole = Role::where('slug', 'admin')->first();
        if ($adminRole) {
            $adminRole->permissions()->sync(Permission::all());
        }

        // Billing User
        $billingRole = Role::where('slug', 'billing-user')->first(); // Assuming explicit slug 'billing-user'
        if (!$billingRole) {
             // Create if not exists ? The user said 'currently we only have two user roles'.
             // Wait, the user said "currently we only have two user roles... i am planning to restructure this".
             // The image showed 'Administrator' and 'User' in the database (id 1 and 2).
             // The text says "System Roles Summary: Admin, Billing User, Supervisor".
             // So I might need to Create these roles if they don't exist?
             // Or maybe 'User' is one of them?
             // The user provided database screenshot shows '1: Administrator (admin)', '2: User (user)'.
             // The request implies NEW roles "Billing User" and "Supervisor".
             // I should create these roles if they don't exist.
             // I will add role creation to this seeder to be safe.
        }
        
        // Let's create the roles as per description
        $roles = [
            ['name' => 'Administrator', 'slug' => 'admin'],
            ['name' => 'Billing User', 'slug' => 'billing-user'],
            ['name' => 'Supervisor', 'slug' => 'supervisor'],
        ];
        
        foreach ($roles as $roleData) {
            Role::firstOrCreate(['slug' => $roleData['slug']], ['name' => $roleData['name']]);
        }
        
        // Re-fetch roles
        $adminRole = Role::where('slug', 'admin')->first();
        $billingRole = Role::where('slug', 'billing-user')->first();
        $supervisorRole = Role::where('slug', 'supervisor')->first();

        // 1. Admin: All
        if ($adminRole) {
            $adminRole->permissions()->sync(Permission::all());
        }

        // 2. Billing User: Invoice (Create, Edit, Delete) - implied View? User said 'Access limited to invoice module'.
        if ($billingRole) {
            $billingPermissions = Permission::whereIn('permission_code', [
                'INVOICE_CREATE', 'INVOICE_EDIT', 'INVOICE_DELETE', 'INVOICE_VIEW'
            ])->get();
            $billingRole->permissions()->sync($billingPermissions);
        }

        // 3. Supervisor: Invoice (All), Product (All), No User/Settings
        if ($supervisorRole) {
             $supervisorPermissions = Permission::whereIn('permission_code', [
                'INVOICE_CREATE', 'INVOICE_EDIT', 'INVOICE_DELETE', 'INVOICE_VIEW',
                'PRODUCT_CREATE', 'PRODUCT_EDIT', 'PRODUCT_DELETE', 'PRODUCT_VIEW'
            ])->get();
            $supervisorRole->permissions()->sync($supervisorPermissions);
        }
    }
}
