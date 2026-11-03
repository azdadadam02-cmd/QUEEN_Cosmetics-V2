<?php

namespace App\Services;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class OrderService
{
    /**
     * Crée commande + détails + paiement (à la livraison) dans UNE transaction.
     * Les prix viennent TOUJOURS de la base (jamais du navigateur) et le stock
     * est décrémenté sans jamais passer sous 0.
     *
     * @param  array<int, array{id:int, quantity:int}>  $items
     * @param  array{nom:string, telephone:string, ville:string, adresse:string}  $livraison
     */
    public function create(User $client, array $items, array $livraison): Order
    {
        return DB::transaction(function () use ($client, $items, $livraison) {
            $wanted = [];
            foreach ($items as $it) {
                $wanted[(int) $it['id']] = ($wanted[(int) $it['id']] ?? 0) + (int) $it['quantity'];
            }

            // Verrouille les lignes produits pendant la transaction (deux clients en même temps)
            $products = Product::withPromo()->whereIn('id', array_keys($wanted))->lockForUpdate()->get()->keyBy('id');

            $lignes = [];
            $total  = 0.0;
            foreach ($wanted as $id => $qte) {
                $p = $products->get($id);
                if (! $p) {
                    throw ValidationException::withMessages(['items' => "Un produit de votre panier n'existe plus."]);
                }
                if ($p->quantite_stock < $qte) {
                    throw ValidationException::withMessages(['items' => "Stock insuffisant pour « {$p->nom} »."]);
                }
                $prix     = $p->finalPrice();
                $lignes[] = [$p, $qte, $prix];
                $total   += $prix * $qte;
            }

            $order = Order::create([
                'client_id'     => $client->id,
                'total'         => round($total, 2),
                'statut'        => Order::EN_ATTENTE,
                'statut_vu'     => Order::EN_ATTENTE,     // le client vient de la voir : pas de badge
                'nom_livraison' => $livraison['nom'],
                'telephone'     => $livraison['telephone'],
                'ville'         => $livraison['ville'],
                'adresse'       => $livraison['adresse'],
                'date_commande' => now(),
            ]);

            foreach ($lignes as [$p, $qte, $prix]) {
                $updated = Product::whereKey($p->id)->where('quantite_stock', '>=', $qte)->decrement('quantite_stock', $qte);
                if ($updated < 1) {
                    throw ValidationException::withMessages(['items' => "Stock insuffisant pour « {$p->nom} »."]);
                }
                OrderItem::create([
                    'commande_id'   => $order->id,
                    'produit_id'    => $p->id,
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

            return $order->load(['items.product', 'payment']);
        });
    }

    /**
     * Accepter / refuser (annuler) / marquer livrée.
     * Refus → stock remis en rayon. Livraison → paiement « Paye ».
     */
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
                foreach ($order->items()->get() as $item) {
                    Product::whereKey($item->produit_id)->increment('quantite_stock', $item->quantite);
                }
            } elseif ($nouveau === Order::LIVREE) {
                Payment::where('commande_id', $order->id)->update(['statut' => Payment::PAYE]);
            }

            return $order->fresh(['client', 'items.product', 'payment']);
        });
    }
}
