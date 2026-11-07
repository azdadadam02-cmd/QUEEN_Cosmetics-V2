<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

/** Responsable commandes (et admin en lecture seule) */
class OrderManagementController extends Controller
{
    /** GET /api/manage/orders?status=En attente */
    public function index(Request $request): JsonResponse
    {
        $status = in_array($request->query('status'), Order::STATUTS, true) ? $request->query('status') : null;

        $orders = Order::with(['client', 'items.product', 'items.variant', 'items.pack', 'payment'])
            ->when($status, fn ($q) => $q->where('statut', $status))
            ->orderByDesc('date_commande')->orderByDesc('id')
            ->get();

        return response()->json([
            'orders'   => OrderResource::collection($orders)->resolve($request),
            'counters' => Order::query()->selectRaw('statut, COUNT(*) as n')->groupBy('statut')->pluck('n', 'statut'),
            'filter'   => $status,
        ]);
    }

    /** PATCH /api/manage/orders/{order}/status  { status: Acceptee|Refusee|Livree } */
    public function updateStatus(Request $request, Order $order, OrderService $service): JsonResponse
    {
        $data = $request->validate(
            ['status' => ['required', Rule::in([Order::ACCEPTEE, Order::REFUSEE, Order::LIVREE])]],
            ['status.*' => 'Action invalide.']
        );

        $order = $service->changeStatus($order, $data['status']);

        $labels = [
            Order::ACCEPTEE => 'acceptée',
            Order::REFUSEE  => 'refusée (stock remis en rayon)',
            Order::LIVREE   => 'marquée comme livrée (paiement encaissé)',
        ];

        return response()->json([
            'message' => "Commande n° {$order->id} {$labels[$data['status']]}.",
            'order'   => new OrderResource($order),
        ]);
    }
}
