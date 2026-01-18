<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SalesController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Middleware\CheckUserRole;

Route::get('/', function () {
    return Inertia::render('Dashboard', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    // Users management routes
    Route::controller(UserController::class)->group(function () {
        Route::get('/users', 'index')->name('users.index')->middleware('can:USER_VIEW');

        Route::middleware('can:USER_CREATE')->group(function () {
            Route::get('/users/create', 'create')->name('users.create');
            Route::post('/users', 'store')->name('users.store');
        });

        Route::middleware('can:USER_EDIT')->group(function () {
            Route::get('/users/{user}/edit', 'edit')->name('users.edit');
            Route::put('/users/{user}', 'update')->name('users.update');
        });

        Route::delete('/users/{user}', 'destroy')->name('users.destroy')->middleware('can:USER_DELETE');
    });

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    //category management routes
    Route::get('/products-categories', [CategoryController::class, 'index'])->name('products.category.index')->middleware('can:PRODUCT_VIEW');
    
    Route::middleware('can:PRODUCT_CREATE')->group(function () {
        Route ::get('/products-category-add',[CategoryController::class, 'add'])->name('products.category.add');
        Route ::post('/products-category-store',[CategoryController::class, 'store'])->name('products.category.store');
    });

    Route::middleware('can:PRODUCT_EDIT')->group(function () {
        Route::get('/product-category/{category}/edit', [CategoryController::class, 'edit'])->name('products.category.edit');
        Route::put('/product-category/{category}/update', [CategoryController::class, 'update'])->name('products.category.update');
    });

    Route::delete('/product-category/{category}/destroy', [CategoryController::class, 'destroy'])->name('products.category.destroy')->middleware('can:PRODUCT_DELETE');

    // Product Management Routes
    Route::get('/products', [ProductController::class, 'index'])->name('products.index')->middleware('can:PRODUCT_VIEW');
    
    // Bulk Upload Routes
    Route::middleware('can:PRODUCT_CREATE')->group(function () {
        Route::get('/products/bulk-upload', [ProductController::class, 'showBulkUploadForm'])->name('products.bulk-upload');
        Route::post('/products/bulk-upload', [ProductController::class, 'processBulkUpload'])->name('products.process-bulk-upload');
        Route::get('/products/download-template', [ProductController::class, 'downloadTemplate'])->name('products.download-template');
        Route::get('/download-product-template', [ProductController::class, 'downloadTemplate'])->name('download.product-template');
    });
    
    // Other Product Routes
    Route::middleware('can:PRODUCT_CREATE')->group(function () {
        Route::get('/products/create', [ProductController::class, 'create'])->name('products.create');
        Route::post('/products', [ProductController::class, 'store'])->name('products.store');
    });
    
    Route::middleware('can:PRODUCT_EDIT')->group(function () {
        Route::get('/product/{product}/edit', [ProductController::class, 'edit'])->name('products.edit');
        Route::put('/product/{product}', [ProductController::class, 'update'])->name('products.update');
    });

    Route::delete('/product/{product}', [ProductController::class, 'destroy'])->name('products.destroy')->middleware('can:PRODUCT_DELETE');
    
    // Sales Management Routes
    Route::get('/sales', [SalesController::class, 'index'])->name('sales.index')->middleware('can:INVOICE_VIEW');
    
    Route::middleware('can:INVOICE_CREATE')->group(function () {
        Route::get('/sales/create', [SalesController::class, 'create'])->name('sales.create');
        Route::post('/sales', [SalesController::class, 'store'])->name('sales.store');
    });

    Route::get('/sales/{sale}', [SalesController::class, 'show'])->name('sales.show')->middleware('can:INVOICE_VIEW');

    Route::middleware('can:INVOICE_EDIT')->group(function () {
        Route::get('/sales/{sale}/edit', [SalesController::class, 'edit'])->name('sales.edit');
        Route::put('/sales/{sale}', [SalesController::class, 'update'])->name('sales.update');
    });

    Route::delete('/sales/{sale}', [SalesController::class, 'destroy'])->name('sales.destroy')->middleware('can:INVOICE_DELETE');
});

// Public route for downloading the product template
Route::get('/public-download-template', [ProductController::class, 'downloadTemplate'])->name('public.download-template');

Route::get('/debug-permissions', function () {
    $user = auth()->user();
    if (!$user) return 'Not logged in';
    
    return [
        'user_id' => $user->id,
        'roles' => $user->roles->pluck('name'),
        'permissions' => $user->roles->flatMap->permissions->pluck('permission_code')->unique()->values()
    ];
})->middleware('auth');

require __DIR__.'/auth.php';
