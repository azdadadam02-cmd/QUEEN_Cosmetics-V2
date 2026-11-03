<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AdvertisementController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\OrderManagementController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| QUEEN Cosmetics — API consommée par Next.js   (préfixe automatique : /api)
|--------------------------------------------------------------------------
| Public           : boutique, publicités, vérification du panier, login/register
| auth:sanctum     : token « Authorization: Bearer … »
| role:xxx         : rôle relu en base à chaque requête (app/Http/Middleware/EnsureRole.php)
*/

Route::middleware('throttle:api')->group(function () {

    /* ── BOUTIQUE (public) ───────────────────────────────── */
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/{product}', [ProductController::class, 'show'])->whereNumber('product');
    Route::get('/categories', [ProductController::class, 'categories']);
    Route::get('/advertisements', [AdvertisementController::class, 'index']);
    Route::post('/cart/check', [CartController::class, 'check']);

    /* ── AUTHENTIFICATION ────────────────────────────────── */
    Route::post('/auth/login', [AuthController::class, 'login']);
    Route::post('/auth/register', [AuthController::class, 'register'])->middleware('throttle:register');

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);

        /* ── ESPACE CLIENT ───────────────────────────────── */
        Route::middleware('role:client')->group(function () {
            Route::post('/orders', [OrderController::class, 'store']);
            Route::get('/notifications', [OrderController::class, 'notifications']);
            Route::get('/notifications/count', [OrderController::class, 'notificationsCount']);
        });

        /* ── RESPONSABLE PRODUITS (+ admin en lecture) ───── */
        Route::get('/manage/products', [ProductController::class, 'manageIndex'])->middleware('role:responsable_produits,admin');
        Route::middleware(['role:responsable_produits', 'throttle:uploads'])->group(function () {
            Route::post('/manage/products', [ProductController::class, 'store']);
            Route::post('/manage/products/{product}', [ProductController::class, 'update'])->whereNumber('product');
        });

        /* ── RESPONSABLE COMMANDES (+ admin en lecture) ──── */
        Route::get('/manage/orders', [OrderManagementController::class, 'index'])->middleware('role:responsable_commandes,admin');
        Route::patch('/manage/orders/{order}/status', [OrderManagementController::class, 'updateStatus'])
            ->whereNumber('order')->middleware('role:responsable_commandes');

        /* ── ADMIN ───────────────────────────────────────── */
        Route::middleware('role:admin')->prefix('admin')->group(function () {
            Route::get('/dashboard', [AdminController::class, 'dashboard']);
            Route::get('/finances', [AdminController::class, 'finances']);

            Route::get('/users', [UserController::class, 'index']);
            Route::post('/users', [UserController::class, 'store']);
            Route::put('/users/{user}', [UserController::class, 'update'])->whereNumber('user');
            Route::delete('/users/{user}', [UserController::class, 'destroy'])->whereNumber('user');

            Route::post('/advertisements', [AdvertisementController::class, 'store'])->middleware('throttle:uploads');
            Route::post('/advertisements/{advertisement}', [AdvertisementController::class, 'update'])->whereNumber('advertisement');
            Route::delete('/advertisements/{advertisement}', [AdvertisementController::class, 'destroy'])->whereNumber('advertisement');
        });
    });
});
