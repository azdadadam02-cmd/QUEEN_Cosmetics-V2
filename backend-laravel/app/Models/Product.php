<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use SoftDeletes;

    const DELETED_AT = 'supprime_le';

    protected $table = 'produits';
    public $timestamps = false;

    protected $fillable = ['nom', 'categorie', 'sous_categorie', 'marque', 'details', 'tranche_age', 'prix', 'quantite_stock', 'image', 'promotion'];

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

    public function scopeWithPromo(Builder $q): Builder
    {
        return $q->withMax(['advertisements as pub_reduction' => fn ($a) => $a->where('reduction', '>', 0)], 'reduction')
            ->withAvg(['reviews as rating_avg' => fn ($r) => $r->where('est_approuve', true)], 'note')
            ->withCount(['reviews as rating_count' => fn ($r) => $r->where('est_approuve', true)]);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class, 'produit_id');
    }

    public function variants(): HasMany
    {
        return $this->hasMany(ProductVariant::class, 'produit_id');
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class, 'produit_id');
    }

    public function favorites(): HasMany
    {
        return $this->hasMany(Favorite::class, 'produit_id');
    }

    public function syncVariantStock(): void
    {
        if ($this->variants()->exists()) {
            $this->update(['quantite_stock' => (int) $this->variants()->sum('quantite_stock')]);
        }
    }

    public function scopeForShop(Builder $q): Builder
    {
        return $q->withPromo()->orderByRaw('quantite_stock <= 0')->orderByDesc('id');
    }

    public function promoPercent(): int
    {
        if (! array_key_exists('pub_reduction', $this->attributes)) {
            $this->attributes['pub_reduction'] = (int) $this->advertisements()->where('reduction', '>', 0)->max('reduction');
        }

        return max((int) $this->promotion, (int) $this->attributes['pub_reduction']);
    }

    public function finalPrice(): float
    {
        $pc = $this->promoPercent();

        return $pc > 0 ? round($this->prix * (100 - $pc) / 100, 2) : (float) $this->prix;
    }

    public static function sansImage(): Collection
    {
        return static::orderBy('id')->get(['id', 'nom', 'marque', 'sous_categorie', 'image'])
            ->filter(fn ($p) => ! $p->image || ! is_file(public_path('images/'.$p->image)));
    }

    public function imageUrl(): ?string
    {
        return $this->image ? asset('images/'.$this->image) : null;
    }
}
