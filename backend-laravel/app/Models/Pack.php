<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/** Offre groupée (tables « packs » et « pack_produit »), vendue à un prix unique */
class Pack extends Model
{
    protected $table = 'packs';
    public $timestamps = false;

    protected $fillable = ['nom', 'description', 'image', 'prix_promo', 'est_actif', 'couleur_fond', 'couleur_texte', 'texte_bouton'];

    protected function casts(): array
    {
        return ['prix_promo' => 'float', 'est_actif' => 'boolean', 'date_creation' => 'datetime'];
    }

    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'pack_produit', 'pack_id', 'produit_id')->withPivot('quantite');
    }

    public function scopeWithDetails(Builder $q): Builder
    {
        return $q->with(['products' => fn ($p) => $p->withPromo(), 'products.variants']);
    }

    /**
     * Combien de packs peuvent être vendus avec le stock actuel.
     * Un produit à variantes bloque le pack : le pack ne saurait pas quelle couleur ou taille retirer du stock.
     */
    public function availableCount(): int
    {
        if ($this->products->isEmpty() || $this->products->contains(fn ($p) => $p->variants->isNotEmpty())) {
            return 0;
        }

        return (int) $this->products->map(fn ($p) => intdiv((int) $p->quantite_stock, max(1, (int) $p->pivot->quantite)))->min();
    }

    /** Valeur des produits achetés séparément (prix barré) */
    public function separateValue(): float
    {
        return round($this->products->sum(fn ($p) => $p->finalPrice() * $p->pivot->quantite), 2);
    }

    /**
     * Répartit le prix du pack sur ses produits, au prorata de leur prix.
     *
     * @return array<int, array{0: Product, 1: int, 2: float}> [produit, quantité totale, prix unitaire]
     */
    public function splitForOrder(int $qty): array
    {
        $weights = $this->products->map(fn ($p) => (float) $p->prix * (int) $p->pivot->quantite);
        $sum     = $weights->sum() ?: 1;
        $cents   = (int) round($this->prix_promo * $qty * 100);
        $left    = $cents;
        $lines   = [];

        foreach ($this->products->values() as $i => $p) {
            $share = $i === $this->products->count() - 1 ? $left : (int) floor($cents * $weights[$i] / $sum);
            $left -= $share;
            $units = (int) $p->pivot->quantite * $qty;
            $lines[] = [$p, $units, round($share / $units / 100, 2)];
        }

        return $lines;
    }
}
