<?php

use App\Http\Controllers\ProductsController;
use App\Models\Product;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::group(['prefix'=>'lk', 'as'=>'lk.'], function(){
    Route::get('/products', function(){
        return Inertia::render('Products');
    })->name('products');
    Route::get('/products/{id}', function($id){
        return Inertia::render('Details', [ 'product' => Product::with('statistics')->find($id) ]);
    })->name('details');
});

// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

// Route::get('/products/{post}', [ProductsController::class, 'store'])->middleware(['auth', 'verified'])->name('details');

Route::resource('/products', ProductsController::class)->only(['index', 'store', 'show', 'update', 'destroy']);

require __DIR__.'/auth.php';
