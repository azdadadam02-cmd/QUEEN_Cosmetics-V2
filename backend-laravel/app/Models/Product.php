<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/** Produit (table « produits ») */
class Product extends Model
{
    protected $table = 'produits';
    public $timestamps = false;

    protected $fillable = ['nom', 'categorie', 'prix', 'quantite_stock', 'image', 'promotion'];

    protected function casts(): array
    {
        return [
            'prix'           => 'float',
            'quantite_stock' => 'integer',
            'promotion'      => 'integer',
        ];
    }

    public function advertisements(): HasMany
    {
        return $this->hasMany(Advertisement::class, 'produit_id');
    }

    /** Charge la plus forte réduction venant des publicités liées (colonne virtuelle pub_reduction) */
    public function scopeWithPromo(Builder $q): Builder
    {
        return $q->withMax(['advertisements as pub_reduction' => fn ($a) => $a->where('reduction', '>', 0)], 'reduction');
    }

    /** Disponibles d'abord, puis les plus récents (comme l'ancien accueil) */
    public function scopeForShop(Builder $q): Builder
    {
        return $q->withPromo()->orderByRaw('quantite_stock <= 0')->orderByDesc('id');
    }

    /** % de réduction appliqué : la promo du produit OU la pub liée, la plus forte des deux */
    public function promoPercent(): int
    {
        if (! array_key_exists('pub_reduction', $this->attributes)) {
            $this->attributes['pub_reduction'] = (int) $this->advertisements()->where('reduction', '>', 0)->max('reduction');
        }

        return max((int) $this->promotion, (int) $this->attributes['pub_reduction']);
    }

    /** Prix réellement payé par le client (c'est lui qui entre dans le panier et la commande) */
    public function finalPrice(): float
    {
        $pc = $this->promoPercent();

        return $pc > 0 ? round($this->prix * (100 - $pc) / 100, 2) : (float) $this->prix;
    }

    public function imageUrl(): ?string
    {
        return $this->image ? asset('images/'.$this->image) : null;
    }
}
