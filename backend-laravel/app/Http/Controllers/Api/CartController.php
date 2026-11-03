<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CartCheckRequest;
use App\Services\CartService;
use Illuminate\Http\JsonResponse;

class CartController extends Controller
{
    /** POST /api/cart/check — { items: [{id, quantity}] } → lignes avec prix/stock à jour */
    public function check(CartCheckRequest $request, CartService $cart): JsonResponse
    {
        return response()->json($cart->lines($request->input('items', [])));
    }
}
