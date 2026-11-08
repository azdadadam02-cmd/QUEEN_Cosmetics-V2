<?php

use Illuminate\Support\Facades\Route;

Route::get('/', fn () => response()->json([
    'app'  => 'QUEEN Cosmetics API',
    'docs' => 'Toutes les routes sont sous /api (voir routes/api.php)',
]));
