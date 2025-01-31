<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CategoryController;
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
        Route::get('/users', 'index')->name('users.index');

        // Apply CheckUserRole middleware to create, edit, and delete routes
        Route::middleware('role')->group(function () {
            Route::get('/users/create', 'create')->name('users.create');
            Route::post('/users', 'store')->name('users.store');
            Route::get('/users/{user}/edit', 'edit')->name('users.edit');
            Route::put('/users/{user}', 'update')->name('users.update');
            Route::delete('/users/{user}', 'destroy')->name('users.destroy');
        });
    });

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    //product management routes
    Route::get('/products', [ProfileController::class, 'edit'])->name('products');
    Route::get('/products', [CategoryController::class, 'index'])->name('products.category');
});

require __DIR__.'/auth.php';
