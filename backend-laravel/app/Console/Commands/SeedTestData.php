<?php

namespace App\Console\Commands;

use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Review;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

/**
 * Données de test : variantes (couleurs / tailles) cohérentes avec chaque produit, stocks variés, notes de 2 à 5.
 * Ne touche ni aux produits qui ont déjà des variantes, ni à ceux d'un pack (un pack refuse les produits à variantes).
 * Tout ce qui est ajouté est noté dans un fichier : `--undo` le retire et remet les anciens stocks.
 */
class SeedTestData extends Command
{
    protected $signature = 'products:fake-data {--undo : retire ce qui a été généré et remet les anciens stocks}';
    protected $description = 'Génère des variantes, des stocks et des avis de test (annulable avec --undo)';

    private const TEINTS = ['#f6dcc3', '#e9bf9a', '#d6a074', '#b9774f', '#8a5638'];
    private const LEVRES = ['#b5736a', '#c1272d', '#8b1e3f', '#e79aa6', '#6b2d3a', '#d4756b'];
    private const VERNIS = ['#c1272d', '#b5736a', '#111111', '#e79aa6', '#1b2a49', '#7b1530', '#f2e3d5', '#4b7f52'];
    private const BRONZES = ['#e0b48a', '#c68642', '#8d5524'];
    private const ACCESSOIRES = ['#b76e79', '#111111', '#f1c9cf', '#ffffff'];

    private function backupFile(): string
    {
        return storage_path('app/fake-data-backup.json');
    }

    public function handle(): int
    {
        return $this->option('undo') ? $this->undo() : $this->generate();
    }

    private function generate(): int
    {
        if (is_file($this->backupFile())) {
            $this->error('Des données de test existent déjà : lance d\'abord  php artisan products:fake-data --undo');

            return self::FAILURE;
        }
        mt_srand(2026);   // mêmes données à chaque génération

        $inPack   = DB::table('pack_produit')->pluck('produit_id')->all();
        $hasVar   = ProductVariant::distinct()->pluck('produit_id')->all();
        $clients  = User::where('role', 'client')->pluck('id')->all();
        $reviewed = Review::distinct()->pluck('produit_id')->all();
        $backup   = ['stocks' => [], 'variants' => [], 'reviews' => []];

        DB::transaction(function () use ($inPack, $hasVar, $clients, $reviewed, &$backup) {
            $products = Product::orderBy('id')->get();
            $variantProducts = [];

            foreach ($products as $p) {
                $backup['stocks'][$p->id] = (int) $p->quantite_stock;
                $skip = in_array($p->id, $inPack) || in_array($p->id, $hasVar);
                $recipe = $skip ? [] : $this->recipe($p);

                if ($recipe) {
                    foreach ($recipe as $row) {
                        $v = ProductVariant::create(['produit_id' => $p->id, 'quantite_stock' => $this->stock($p, true)] + $row + ['couleur' => null, 'taille' => null, 'volume_ml' => null, 'poids_g' => null, 'quantite_pieces' => null]);
                        $backup['variants'][] = $v->id;
                    }
                    $variantProducts[] = $p->id;
                } elseif (! in_array($p->id, $hasVar)) {
                    // Sans variantes : stock simple (jamais 0 pour les produits d'un pack, sinon le pack devient indisponible)
                    $p->update(['quantite_stock' => max($this->stock($p, false), in_array($p->id, $inPack) ? 10 : 0)]);
                }
            }

            // Cas à tester : 3 produits en rupture, 4 en stock faible (total ≤ 5)
            shuffle($variantProducts);
            foreach (array_slice($variantProducts, 0, 3) as $id) {
                ProductVariant::where('produit_id', $id)->update(['quantite_stock' => 0]);
            }
            foreach (array_slice($variantProducts, 3, 4) as $id) {
                $ids = ProductVariant::where('produit_id', $id)->pluck('id');
                foreach ($ids as $i => $vid) {
                    ProductVariant::whereKey($vid)->update(['quantite_stock' => $i < 5 ? 1 : 0]);
                }
            }
            foreach ($variantProducts as $id) {
                Product::find($id)->syncVariantStock();
            }

            // Notes : chaque produit vise 2, 3, 4 ou 5 étoiles (moyenne arrondie), avec 1 à 5 avis de clients différents
            if ($clients) {
                foreach ($products as $p) {
                    if ($p->trashed() || in_array($p->id, $reviewed)) {
                        continue;
                    }
                    $target = mt_rand(2, 5);
                    $count  = mt_rand(1, min(5, count($clients)));
                    $notes  = array_fill(0, $count, $target);
                    if ($count >= 3 && $target < 5) {
                        $notes[1] = $target + 1;
                    }
                    if ($count >= 3 && $target > 2) {
                        $notes[2] = $target - 1;
                    }
                    shuffle($clients);
                    foreach ($notes as $i => $note) {
                        $r = Review::create([
                            'produit_id' => $p->id, 'utilisateur_id' => $clients[$i], 'note' => $note,
                            'commentaire' => null, 'est_approuve' => true, 'date_avis' => now()->subDays(mt_rand(1, 90)),
                        ]);
                        $backup['reviews'][] = $r->id;
                    }
                }
            }
        });

        file_put_contents($this->backupFile(), json_encode($backup));
        $this->info(count($backup['variants']).' variantes et '.count($backup['reviews']).' avis ajoutés. Pour tout annuler : php artisan products:fake-data --undo');

        return self::SUCCESS;
    }

    private function undo(): int
    {
        if (! is_file($this->backupFile())) {
            $this->warn('Rien à annuler (aucune donnée de test enregistrée).');

            return self::SUCCESS;
        }
        $backup = json_decode(file_get_contents($this->backupFile()), true);

        DB::transaction(function () use ($backup) {
            Review::whereIn('id', $backup['reviews'])->delete();
            ProductVariant::whereIn('id', $backup['variants'])->delete();
            foreach ($backup['stocks'] as $id => $stock) {
                DB::table('produits')->where('id', $id)->update(['quantite_stock' => $stock]);
            }
        });
        unlink($this->backupFile());
        $this->info('Données de test retirées, anciens stocks remis.');

        return self::SUCCESS;
    }

    /** Stock selon le prix : un produit bon marché se vend (et se stocke) plus qu'un produit cher ; quelques variantes à 0 ou presque */
    private function stock(Product $p, bool $variant): int
    {
        $base  = $p->prix < 100 ? 120 : ($p->prix < 200 ? 60 : ($p->prix < 300 ? 30 : 14));
        $stock = (int) round($base * mt_rand(30, 100) / 100);
        if ($variant) {
            $roll = mt_rand(1, 100);
            $stock = $roll <= 8 ? 0 : ($roll <= 18 ? mt_rand(1, 5) : $stock);
        }

        return $stock;
    }

    private function pick(array $values, int $min, int $max): array
    {
        shuffle($values);

        return array_slice($values, 0, mt_rand($min, min($max, count($values))));
    }

    private function shades(array $colors, int $min, int $max, array $extra = []): array
    {
        return array_map(fn ($c) => ['couleur' => $c] + $extra, $this->pick($colors, $min, $max));
    }

    private function sizes(string $field, array $values, int $min = 2): array
    {
        return array_map(fn ($v) => [$field => $v], $this->pick($values, $min, count($values)));
    }

    /**
     * Variantes logiques ; [] = pas de variantes pour ce produit.
     * Le NOM décide d'abord (les sous-catégories de la base sont mélangées : « Naked Palette » y est rangé en Eyeliner),
     * la sous-catégorie ne sert qu'aux noms qu'aucune règle ne reconnaît.
     */
    private function recipe(Product $p): array
    {
        return $this->byName($p) ?? $this->bySubCategory($p);
    }

    private function byName(Product $p): ?array
    {
        $n = Str::lower($p->nom ?? '');
        $c = Str::lower($p->categorie ?? '');
        $any = fn (array $words) => collect($words)->contains(fn ($w) => str_contains($n, $w));

        return match (true) {
            $any(['recourbe'])                  => [],   // un seul modèle
            $any(['nettoyant pinceaux'])        => $this->sizes('volume_ml', [100, 200]),
            $any(['kit pinceaux'])              => $this->sizes('quantite_pieces', [5, 8, 12]),
            $any(['blender', 'eponge'])         => $this->combos([['#f1c9cf', 1], ['#e9bf9a', 2], ['#111111', 4], ['#f1c9cf', 4]], 'quantite_pieces'),
            $any(['pinceau'])                   => $this->combos([['#b76e79', 'S'], ['#b76e79', 'M'], ['#111111', 'M'], ['#111111', 'L'], ['#f1c9cf', 'S']], 'taille'),
            $any(['trousse'])                   => $this->combos([['#111111', 'S'], ['#111111', 'L'], ['#b76e79', 'M'], ['#ffffff', 'M']], 'taille'),
            $any(['palette', 'desert dusk', 'soft glam', 'rose metals']) => [['couleur' => '#c9a68f', 'quantite_pieces' => 9], ['couleur' => '#4b4048', 'quantite_pieces' => 12], ['couleur' => '#d9a0a6', 'quantite_pieces' => 18]],
            $any(['liner', 'epic ink'])         => [['couleur' => '#111111'], ['couleur' => '#4a3425'], ['couleur' => '#1b2a49']],
            $any(['lash', 'mascara', 'better than sex']) => [['couleur' => '#111111', 'volume_ml' => 10], ['couleur' => '#4a3425', 'volume_ml' => 10], ['couleur' => '#111111', 'volume_ml' => 14]],
            str_contains($c, 'parfum')          => $any(['brume']) ? $this->sizes('volume_ml', [100, 200])
                : ($any(['coffret']) ? array_map(fn ($k) => ['taille' => 'Coffret', 'quantite_pieces' => $k], [2, 3]) : $this->sizes('volume_ml', [30, 50, 100])),
            str_contains($c, 'cheveux')         => $any(['shampoing']) ? $this->sizes('volume_ml', [250, 400, 750]) : ($any(['masque', 'creme', 'soin']) ? $this->sizes('volume_ml', [200, 500]) : $this->sizes('volume_ml', [50, 100])),
            str_contains($c, 'ongles')          => $any(['vernis']) ? $this->shades(self::VERNIS, 5, 8, ['volume_ml' => 10]) : $this->sizes('volume_ml', $any(['dissolvant']) ? [50, 100] : [10, 15]),
            str_contains($c, 'corps')           => match (true) {
                $any(['gommage'])                 => $this->sizes('poids_g', [200, 350]),
                $any(['beurre', 'baume'])         => $this->sizes('poids_g', [150, 250]),
                $any(['mains', 'pieds'])          => $this->sizes('volume_ml', [50, 100]),
                default                           => $this->sizes('volume_ml', [200, 400]),
            },
            str_contains($c, 'solaire')         => match (true) {
                $any(['autobronz'])               => $this->shades(self::BRONZES, 2, 3, ['volume_ml' => $any(['gouttes']) ? 30 : 150]),
                $any(['apres', 'apaisant'])       => $this->sizes('volume_ml', [150, 300]),
                $any(['stick'])                   => [['taille' => 'SPF30', 'poids_g' => 15], ['taille' => 'SPF50', 'poids_g' => 15]],
                default                           => $this->pick([['taille' => 'SPF30', 'volume_ml' => 100], ['taille' => 'SPF50', 'volume_ml' => 50], ['taille' => 'SPF50', 'volume_ml' => 100], ['taille' => 'SPF50', 'volume_ml' => 200]], 3, 4),
            },
            str_contains($c, 'soin visage')     => match (true) {
                $any(['serum', 'niacinamide'])    => $this->sizes('volume_ml', [15, 30]),
                $any(['moussant', 'nettoyant', 'micellaire', 'lotion']) => $this->sizes('volume_ml', [100, 200]),
                default                           => $this->sizes('volume_ml', [30, 50, 100]),
            },
            default                             => null,
        };
    }

    private function bySubCategory(Product $p): array
    {
        $s = Str::lower($p->sous_categorie ?? '');
        $c = Str::lower($p->categorie ?? '');
        $n = Str::lower($p->nom ?? '');
        $has = fn (string $k, string $in) => str_contains($in, $k);

        return match (true) {
            $has('fond de teint', $s) => $this->shades(self::TEINTS, 3, 5, ['volume_ml' => 30]),
            $has('anticernes', $s)    => $this->shades(self::TEINTS, 3, 4, ['volume_ml' => 7]),
            $has('poudre', $s)        => $this->shades(self::TEINTS, 3, 4, ['poids_g' => 10]),
            $has('mascara', $s)       => [['couleur' => '#111111', 'volume_ml' => 10], ['couleur' => '#4a3425', 'volume_ml' => 10], ['couleur' => '#111111', 'volume_ml' => 14]],
            $has('eyeliner', $s)      => [['couleur' => '#111111'], ['couleur' => '#4a3425'], ['couleur' => '#1b2a49']],
            $has('palette', $s)       => [['couleur' => '#c9a68f', 'quantite_pieces' => 9], ['couleur' => '#4b4048', 'quantite_pieces' => 12], ['couleur' => '#d9a0a6', 'quantite_pieces' => 18]],
            $has('levres', $s) || $has('gloss', $s) || $has('crayon', $s) => $this->shades(self::LEVRES, 4, 6),
            $has('cheveux', $s) || $has('shampoing', $s) || $has('capillaire', $s) => $this->sizes('volume_ml', $has('masque', $s) ? [200, 500] : ($has('serum', $s) ? [50, 100] : [250, 400, 750])),
            $has('serum', $s)         => $this->sizes('volume_ml', [15, 30]),
            $has('nettoyant', $s)     => $this->sizes('volume_ml', [100, 200]),
            $has('creme hydratante', $s) || $has('visage', $c) => $this->sizes('volume_ml', [30, 50, 100]),
            $has('eau de parfum', $s) || ($has('parfum', $c) && ! $has('brume', $s) && ! $has('coffret', $s)) => $this->sizes('volume_ml', [30, 50, 100]),
            $has('brume', $s)         => $this->sizes('volume_ml', [100, 200]),
            $has('coffret', $s)       => array_map(fn ($k) => ['taille' => 'Coffret', 'quantite_pieces' => $k], [2, 3]),
            $has('vernis', $s)        => $this->shades(self::VERNIS, 5, 8, ['volume_ml' => $has('gel', $s) ? 8 : 10]),
            $has('ongles', $s)        => $this->sizes('volume_ml', [10, 15]),
            $has('pinceaux', $s)      => $this->combos([['#b76e79', 'S'], ['#b76e79', 'M'], ['#111111', 'M'], ['#111111', 'L'], ['#f1c9cf', 'S']], 'taille'),
            $has('eponges', $s)       => $this->combos([['#f1c9cf', 1], ['#e9bf9a', 2], ['#111111', 4], ['#f1c9cf', 4]], 'quantite_pieces'),
            $has('trousses', $s)      => $this->combos([['#111111', 'S'], ['#111111', 'L'], ['#b76e79', 'M'], ['#ffffff', 'M']], 'taille'),
            $has('lait', $s)          => $this->sizes('volume_ml', [200, 400]),
            $has('mains', $s)         => $this->sizes('volume_ml', [50, 100]),
            $has('gommage', $s)       => $this->sizes($has('gel', $n) ? 'volume_ml' : 'poids_g', $has('gel', $n) ? [250, 500] : [200, 350]),
            $has('ecran', $s)         => array_map(fn ($r) => $r, $this->pick([['taille' => 'SPF30', 'volume_ml' => 100], ['taille' => 'SPF50', 'volume_ml' => 50], ['taille' => 'SPF50', 'volume_ml' => 100], ['taille' => 'SPF50', 'volume_ml' => 200]], 3, 4)),
            $has('apres', $s)         => $this->sizes('volume_ml', [150, 300]),
            $has('autobronzant', $s)  => $this->shades(self::BRONZES, 2, 3, ['volume_ml' => 150]),
            $has('soin', $c) || $has('creme', $n) => $this->sizes('volume_ml', [50, 100]),
            default                   => [],
        };
    }

    /** [[couleur, valeur]] → lignes de variantes (la valeur va dans $field) */
    private function combos(array $pairs, string $field): array
    {
        return array_map(fn ($pair) => ['couleur' => $pair[0], $field => $pair[1]], $this->pick($pairs, 3, count($pairs)));
    }
}
