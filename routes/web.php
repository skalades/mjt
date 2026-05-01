<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\MoldController;
use App\Http\Controllers\FinanceController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\OrderMaterialUsageController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Settings
    Route::get('/settings', [SettingController::class, 'index'])->name('settings.index');
    Route::post('/settings', [SettingController::class, 'update'])->name('settings.update');

    // Documents (PDF)
    Route::get('/orders/{id}/invoice', [DocumentController::class, 'invoice'])->name('documents.invoice');
    Route::get('/orders/{id}/delivery-order', [DocumentController::class, 'deliveryOrder'])->name('documents.delivery-order');
    Route::get('/reports/finance', [DocumentController::class, 'financeReport'])->name('documents.finance-report');
    Route::get('/reports/inventory', [DocumentController::class, 'inventoryReport'])->name('documents.inventory-report');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // MRP Modules
    Route::resource('inventory', InventoryController::class);
    Route::post('/orders/{order}/payment', [OrderController::class, 'recordPayment'])->name('orders.payment');
    Route::post('/orders/{order}/material-usage', [OrderMaterialUsageController::class, 'store'])->name('orders.material-usage');
    Route::delete('/material-usage/{usage}', [OrderMaterialUsageController::class, 'destroy'])->name('material-usage.destroy');
    Route::resource('orders', OrderController::class);
    Route::resource('molds', MoldController::class);
    Route::resource('finance', FinanceController::class);
});

require __DIR__.'/auth.php';
