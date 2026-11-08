<?php

namespace App\Services;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Pack;
use App\Models\Payment;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class OrderService
{
    public function create(User $client, array $items, array $livraison): Order
    {
        return DB::transaction(function () use ($client, $items, $livraison) {
            $wanted = [];
            $wantedPacks = [];
            foreach ($items as $it) {
                if (! empty($it['pack_id'])) {
                    $wantedPacks[(int) $it['pack_id']] = ($wantedPacks[(int) $it['pack_id']] ?? 0) + (int) $it['quantity'];
                    continue;
                }
                $key = (int) $it['id'].':'.(int) ($it['variant_id'] ?? 0);
                $wanted[$key] = ($wanted[$key] ?? 0) + (int) $it['quantity'];
            }
            $packs = Pack::withDetails()->whereIn('id', array_keys($wantedPacks))->get()->keyBy('id');

            $ids      = array_map(fn ($k) => (int) explode(':', $k)[0], array_keys($wanted));
            $ids      = array_merge($ids, $packs->flatMap(fn ($pack) => $pack->products->pluck('id'))->all());
            $products = Product::withPromo()->whereIn('id', $ids)->lockForUpdate()->get()->keyBy('id');
            $variants = ProductVariant::whereIn('produit_id', $ids)->lockForUpdate()->get()->keyBy('id');

            $lignes = [];
            $total  = 0.0;

            foreach ($wantedPacks as $packId => $qte) {
                $pack = $packs->get($packId);
                if (! $pack || ! $pack->est_actif || $pack->products->isEmpty()) {
                    throw ValidationException::withMessages(['items' => "Un pack de votre panier n'est plus disponible."]);
                }
                foreach ($pack->splitForOrder($qte) as [$p, $units, $prix]) {
                    if ($variants->contains('produit_id', $p->id)) {
                        throw ValidationException::withMessages(['items' => "« {$pack->nom} » n'est plus disponible."]);
                    }
                    $lignes[] = [$p, null, $units, $prix, $pack->id];
                }
                $total += $pack->prix_promo * $qte;
            }

            foreach ($wanted as $key => $qte) {
                [$id, $variantId] = array_map('intval', explode(':', $key));
                $p = $products->get($id);
                if (! $p) {
                    throw ValidationException::withMessages(['items' => "Un produit de votre panier n'existe plus."]);
                }
                $v = $variantId ? $variants->get($variantId) : null;
                if ($variantId && (! $v || (int) $v->produit_id !== (int) $p->id)) {
                    throw ValidationException::withMessages(['items' => "Une option de « {$p->nom} » n'existe plus."]);
                }
                if (! $v && $variants->contains('produit_id', $p->id)) {
                    throw ValidationException::withMessages(['items' => "Choisissez une option pour « {$p->nom} »."]);
                }
                if (($v ? $v->quantite_stock : $p->quantite_stock) < $qte) {
                    throw ValidationException::withMessages(['items' => "Stock insuffisant pour « {$p->nom} »."]);
                }
                $prix     = $p->finalPrice();
                $lignes[] = [$p, $v, $qte, $prix, null];
                $total   += $prix * $qte;
            }

            $order = Order::create([
                'client_id'     => $client->id,
                'total'         => round($total, 2),
                'statut'        => Order::EN_ATTENTE,
                'statut_vu'     => Order::EN_ATTENTE,
                'nom_livraison' => $livraison['nom'],
                'telephone'     => $livraison['telephone'],
                'ville'         => $livraison['ville'],
                'adresse'       => $livraison['adresse'],
                'date_commande' => now(),
            ]);

            foreach ($lignes as [$p, $v, $qte, $prix, $packId]) {
                $updated = Product::whereKey($p->id)->where('quantite_stock', '>=', $qte)->decrement('quantite_stock', $qte);
                if ($v) {
                    $updated = min($updated, ProductVariant::whereKey($v->id)->where('quantite_stock', '>=', $qte)->decrement('quantite_stock', $qte));
                }
                if ($updated < 1) {
                    throw ValidationException::withMessages(['items' => "Stock insuffisant pour « {$p->nom} »."]);
                }
                OrderItem::create([
                    'commande_id'   => $order->id,
                    'produit_id'    => $p->id,
                    'variante_id'   => $v?->id,
                    'pack_id'       => $packId,
                    'quantite'      => $qte,
                    'prix_unitaire' => $prix,
                ]);
            }

            Payment::create([
                'commande_id' => $order->id,
                'montant'     => round($total, 2),
                'methode'     => 'Livraison',
                'statut'      => Payment::NON_PAYE,
            ]);

            return $order->load(['items.product', 'items.variant', 'items.pack', 'payment']);
        });
    }

    public function changeStatus(Order $order, string $nouveau): Order
    {
        return DB::transaction(function () use ($order, $nouveau) {
            $actuel = Order::whereKey($order->id)->lockForUpdate()->value('statut');

            if (! in_array($nouveau, Order::TRANSITIONS[$actuel] ?? [], true)) {
                throw ValidationException::withMessages([
                    'statut' => "Cette commande ne peut pas passer de « {$actuel} » à « {$nouveau} ».",
                ]);
            }

            $ok = Order::whereKey($order->id)->where('statut', $actuel)->update(['statut' => $nouveau]);
            if ($ok < 1) {
                throw ValidationException::withMessages(['statut' => "Cette commande vient d'être modifiée par quelqu'un d'autre."]);
            }

            if ($nouveau === Order::REFUSEE) {
                foreach ($order->items()->with('product')->get() as $item) {
                    if ($item->variante_id) {
                        ProductVariant::whereKey($item->variante_id)->increment('quantite_stock', $item->quantite);
                    }
                    Product::withTrashed()->whereKey($item->produit_id)->increment('quantite_stock', $item->quantite);
                    $item->product?->syncVariantStock();
                }
            } elseif ($nouveau === Order::LIVREE) {
                Payment::where('commande_id', $order->id)->update(['statut' => Payment::PAYE]);
            }

            return $order->fresh(['client', 'items.product', 'items.variant', 'items.pack', 'payment']);
        });
    }
}
