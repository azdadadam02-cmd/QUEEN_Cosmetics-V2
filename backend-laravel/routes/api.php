<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AdvertisementController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\FavoriteController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\OrderManagementController;
use App\Http\Controllers\Api\PackController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\TopBarController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware('throttle:api')->group(function () {

    /* ── BOUTIQUE (public) ───────────────────────────────── */
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/suggestions', [ProductController::class, 'suggestions']);
    Route::get('/products/{product}', [ProductController::class, 'show'])->whereNumber('product');
    Route::get('/products/{product}/reviews', [ReviewController::class, 'index'])->whereNumber('product');
    Route::get('/packs', [PackController::class, 'index']);
    Route::get('/packs/{pack}', [PackController::class, 'show'])->whereNumber('pack');
    Route::get('/categories', [ProductController::class, 'categories']);
    Route::get('/advertisements', [AdvertisementController::class, 'index']);
    Route::get('/top-bars', [TopBarController::class, 'index']);
    Route::get('/service-links', [TopBarController::class, 'serviceLinks']);
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
            Route::post('/products/{product}/reviews', [ReviewController::class, 'store'])->whereNumber('product');
            Route::get('/products/{product}/reviews/mine', [ReviewController::class, 'mine'])->whereNumber('product');
            Route::get('/favorites', [FavoriteController::class, 'index']);
            Route::get('/favorites/products', [FavoriteController::class, 'products']);
            Route::post('/reports', [ReportController::class, 'store'])->middleware('throttle:5,1');
            Route::get('/profile', [ProfileController::class, 'show']);
            Route::put('/profile', [ProfileController::class, 'update']);
            Route::post('/profile/image', [ProfileController::class, 'updateImage'])->middleware('throttle:uploads');
            Route::delete('/profile/image', [ProfileController::class, 'destroyImage']);
            Route::delete('/profile', [ProfileController::class, 'destroy']);
            Route::post('/products/{product}/favorite', [FavoriteController::class, 'toggle'])->whereNumber('product');
            Route::get('/notifications', [OrderController::class, 'notifications']);
            Route::get('/notifications/count', [OrderController::class, 'notificationsCount']);
        });

        /* ── RESPONSABLE PRODUITS (+ admin en lecture) ───── */
        Route::get('/manage/products', [ProductController::class, 'manageIndex'])->middleware('role:responsable_produits,admin');
        Route::get('/manage/packs', [PackController::class, 'manageIndex'])->middleware('role:responsable_produits,admin');
        Route::delete('/manage/packs/{pack}', [PackController::class, 'destroy'])->whereNumber('pack')->middleware('role:responsable_produits,admin');
        Route::middleware(['role:responsable_produits,admin', 'throttle:uploads'])->group(function () {
            Route::post('/manage/packs', [PackController::class, 'store']);
            Route::post('/manage/packs/{pack}', [PackController::class, 'update'])->whereNumber('pack');
        });
        Route::middleware(['role:responsable_produits', 'throttle:uploads'])->group(function () {
            Route::post('/manage/products', [ProductController::class, 'store']);
            Route::post('/manage/products/{product}', [ProductController::class, 'update'])->whereNumber('product');
            Route::delete('/manage/products/{product}', [ProductController::class, 'destroy'])->whereNumber('product');
            Route::post('/manage/products/{id}/restore', [ProductController::class, 'restore'])->whereNumber('id');
            Route::delete('/manage/products/{id}/force', [ProductController::class, 'forceDestroy'])->whereNumber('id');
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

            Route::get('/top-bars', [TopBarController::class, 'adminIndex']);
            Route::post('/usps', [TopBarController::class, 'uspStore']);
            Route::put('/usps/{usp}', [TopBarController::class, 'uspUpdate'])->whereNumber('usp');
            Route::delete('/usps/{usp}', [TopBarController::class, 'uspDestroy'])->whereNumber('usp');
            Route::post('/promos', [TopBarController::class, 'promoStore']);
            Route::put('/promos/{promo}', [TopBarController::class, 'promoUpdate'])->whereNumber('promo');
            Route::delete('/promos/{promo}', [TopBarController::class, 'promoDestroy'])->whereNumber('promo');
            Route::put('/header', [TopBarController::class, 'headerUpdate']);
            Route::put('/service-links', [TopBarController::class, 'serviceLinksUpdate']);

            Route::get('/reports', [ReportController::class, 'adminIndex']);

            Route::get('/reviews', [ReviewController::class, 'adminIndex']);
            Route::patch('/reviews/{review}', [ReviewController::class, 'adminUpdate'])->whereNumber('review');
            Route::delete('/reviews/{review}', [ReviewController::class, 'adminDestroy'])->whereNumber('review');
        });
    });
});
