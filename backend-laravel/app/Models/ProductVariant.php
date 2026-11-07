<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/** Variante vendable d'un produit : couleur et/ou taille, avec son propre stock (table « variantes_produits ») */
class ProductVariant extends Model
{
    protected $table = 'variantes_produits';
    public $timestamps = false;

    protected $fillable = ['produit_id', 'couleur', 'taille', 'volume_ml', 'poids_g', 'quantite_pieces', 'quantite_stock'];

    protected function casts(): array
    {
        return ['volume_ml' => 'integer', 'poids_g' => 'integer', 'quantite_pieces' => 'integer', 'quantite_stock' => 'integer'];
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'produit_id');
    }

    /** « 12 mm · 50 ml · 30 g · 3 pcs » : ce que le client voit sur le bouton de taille */
    public function sizeLabel(): ?string
    {
        $parts = array_filter([
            $this->taille,
            $this->volume_ml ? "{$this->volume_ml} ml" : null,
            $this->poids_g ? "{$this->poids_g} g" : null,
            $this->quantite_pieces ? "{$this->quantite_pieces} pcs" : null,
        ]);

        return $parts ? implode(' · ', $parts) : null;
    }
}
