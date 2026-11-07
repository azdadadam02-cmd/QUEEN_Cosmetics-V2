<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\RateLimiter;

/** Espace client : passer commande + notifications (suivi des commandes) */
class OrderController extends Controller
{
    /** POST /api/orders */
    public function store(StoreOrderRequest $request, OrderService $service): JsonResponse
    {
        $user = $request->user();

        if ($user->orders()->where('statut', Order::EN_ATTENTE)->count() >= Order::MAX_EN_ATTENTE_PAR_CLIENT) {
            return response()->json([
                'message' => "Vous avez déjà 5 commandes en attente. Patientez leur traitement avant d'en passer une nouvelle.",
            ], 429);
        }

        $key = 'commande:'.$user->id;
        if (RateLimiter::tooManyAttempts($key, Order::MAX_PAR_HEURE)) {
            Log::channel('security')->warning('commande_limite', ['user' => $user->id]);

            return response()->json(['message' => 'Trop de commandes en peu de temps. Réessayez plus tard.'], 429);
        }

        $order = $service->create($user, $request->input('items'), $request->only('nom', 'telephone', 'ville', 'adresse'));
        RateLimiter::hit($key, 3600);

        return response()->json([
            'message' => "Commande #{$order->id} enregistrée — vous réglerez à la livraison.",
            'order'   => new OrderResource($order->fresh(['items.product', 'items.variant', 'items.pack', 'payment'])),
        ], 201);
    }

    /** GET /api/notifications — commandes du client (avec is_new), puis tout est marqué comme lu */
    public function notifications(Request $request): JsonResponse
    {
        $orders = $request->user()->orders()
            ->with(['items.product', 'items.variant', 'items.pack', 'payment'])
            ->orderByDesc('date_commande')->orderByDesc('id')
            ->get();

        $data = OrderResource::collection($orders)->resolve($request);

        $request->user()->orders()
            ->where(fn ($q) => $q->whereNull('statut_vu')->orWhereColumn('statut_vu', '<>', 'statut'))
            ->update(['statut_vu' => DB::raw('statut')]);

        return response()->json($data);
    }

    /** GET /api/notifications/count — pour le badge de la navbar */
    public function notificationsCount(Request $request): JsonResponse
    {
        $n = $request->user()->orders()
            ->where(fn ($q) => $q->whereNull('statut_vu')->orWhereColumn('statut_vu', '<>', 'statut'))
            ->count();

        return response()->json(['count' => $n]);
    }
}
