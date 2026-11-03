<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Services\FinanceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/** Admin : tableau de bord + finances (lecture seule) */
class AdminController extends Controller
{
    /** GET /api/admin/dashboard */
    public function dashboard(FinanceService $finance): JsonResponse
    {
        $orders = Order::query()->selectRaw('statut, COUNT(*) as n')->groupBy('statut')->pluck('n', 'statut');
        $roles  = User::where('role', '<>', 'admin')->selectRaw('role, COUNT(*) as n')->groupBy('role')->pluck('n', 'role');

        return response()->json([
            'products' => [
                'total'   => Product::count(),
                'rupture' => Product::where('quantite_stock', '<=', 0)->count(),
                'faible'  => Product::whereBetween('quantite_stock', [1, 5])->count(),
                'unites'  => (int) Product::sum('quantite_stock'),
            ],
            'orders'       => $orders,
            'orders_total' => (int) $orders->sum(),
            'roles'        => $roles,
            'users_total'  => (int) $roles->sum(),
            'finance'      => $finance->summary(),
        ]);
    }

    /** GET /api/admin/finances?filter=paye|encaisser */
    public function finances(Request $request, FinanceService $finance): JsonResponse
    {
        $filter = in_array($request->query('filter'), ['paye', 'encaisser'], true) ? $request->query('filter') : '';

        return response()->json([
            'summary'  => $finance->summary(),
            'days'     => $finance->perDay(14),
            'payments' => $finance->payments($filter),
            'filter'   => $filter,
        ]);
    }
}
