<?php

use App\Http\Controllers\Api\CatalogueController;
use Illuminate\Support\Facades\Route;

Route::prefix('catalogue')->group(function () {
    Route::get('/categories', [CatalogueController::class, 'categories'])->name('api.catalogue.categories');
    Route::get('/products', [CatalogueController::class, 'products'])->name('api.catalogue.products');
});
