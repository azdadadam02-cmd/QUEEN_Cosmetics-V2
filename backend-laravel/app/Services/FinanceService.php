<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Payment;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class FinanceService
{
    public function summary(): array
    {
        $debutMois = Carbon::now()->startOfMonth();

        $r = DB::table('paiements as p')
            ->join('commandes as c', 'c.id', '=', 'p.commande_id')
            ->selectRaw("
                COALESCE(SUM(CASE WHEN p.statut = 'Paye' THEN p.montant END), 0) AS encaisse,
                COALESCE(SUM(CASE WHEN p.statut = 'Paye' AND c.date_commande >= ? THEN p.montant END), 0) AS mois,
                COALESCE(SUM(CASE WHEN p.statut <> 'Paye' AND c.statut = 'Acceptee' THEN p.montant END), 0) AS a_encaisser,
                COALESCE(SUM(CASE WHEN p.statut <> 'Paye' AND c.statut = 'En attente' THEN p.montant END), 0) AS en_attente,
                COALESCE(SUM(CASE WHEN c.statut = 'Refusee' THEN p.montant END), 0) AS refuse,
                COALESCE(SUM(CASE WHEN p.statut = 'Paye' THEN 1 ELSE 0 END), 0) AS nb_payes
            ", [$debutMois])
            ->first();

        $r = array_map('floatval', (array) $r);
        $r['panier_moyen'] = $r['nb_payes'] > 0 ? round($r['encaisse'] / $r['nb_payes'], 2) : 0.0;

        return $r;
    }

    public function perDay(int $n = 14): array
    {
        $from = Carbon::today()->subDays($n - 1);

        $rows = DB::table('paiements as p')
            ->join('commandes as c', 'c.id', '=', 'p.commande_id')
            ->where('p.statut', Payment::PAYE)
            ->where('c.date_commande', '>=', $from)
            ->selectRaw('DATE(c.date_commande) AS j, SUM(p.montant) AS m, COUNT(*) AS n')
            ->groupBy(DB::raw('DATE(c.date_commande)'))
            ->get()
            ->keyBy('j');

        $out = [];
        for ($i = $n - 1; $i >= 0; $i--) {
            $d = Carbon::today()->subDays($i)->toDateString();
            $out[] = [
                'day'    => $d,
                'amount' => (float) ($rows[$d]->m ?? 0),
                'count'  => (int) ($rows[$d]->n ?? 0),
            ];
        }

        return $out;
    }

    public function payments(string $filter = ''): array
    {
        $q = DB::table('paiements as p')
            ->join('commandes as c', 'c.id', '=', 'p.commande_id')
            ->leftJoin('utilisateurs as u', 'u.id', '=', 'c.client_id')
            ->select('p.id', 'p.commande_id', 'p.montant', 'p.methode', 'p.statut as paiement_statut',
                'c.date_commande', 'c.statut', 'u.nom as client_nom', 'u.email as client_email')
            ->orderByDesc('c.date_commande')->orderByDesc('p.id');

        if ($filter === 'paye') {
            $q->where('p.statut', Payment::PAYE);
        } elseif ($filter === 'encaisser') {
            $q->where('p.statut', '<>', Payment::PAYE)->whereIn('c.statut', [Order::ACCEPTEE, Order::EN_ATTENTE]);
        }

        return $q->get()->map(fn ($p) => [
            'id'             => (int) $p->id,
            'order_id'       => (int) $p->commande_id,
            'amount'         => (float) $p->montant,
            'method'         => $p->methode,
            'payment_status' => $p->paiement_statut,
            'order_status'   => $p->statut,
            'date'           => $p->date_commande ? Carbon::parse($p->date_commande)->toIso8601String() : null,
            'client'         => ['name' => $p->client_nom, 'email' => $p->client_email],
        ])->all();
    }
}
