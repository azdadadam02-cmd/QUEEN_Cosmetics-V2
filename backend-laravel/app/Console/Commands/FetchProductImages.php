<?php

namespace App\Console\Commands;

use App\Models\Product;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

/**
 * Télécharge, pour chaque produit sans image, la photo trouvée sur Open Beauty Facts (base ouverte)
 * dans un dossier « <id>.jpg » + report.csv. Ne touche pas à la base : on vérifie le dossier,
 * puis `products:import-images <dossier>` fait l'association.
 */
class FetchProductImages extends Command
{
    protected $signature = 'products:fetch-images {dir? : dossier de sortie (défaut storage/app/product-images-import)} {--limit=0 : nombre max de produits} {--souple : accepte une photo approximative (nom ou catégorie seulement)}';
    protected $description = 'Télécharge des photos de produits depuis Open Beauty Facts';

    public function handle(): int
    {
        $dir = $this->argument('dir') ?: storage_path('app/product-images-import');
        is_dir($dir) || mkdir($dir, 0777, true);

        $report = fopen($dir.'/report.csv', 'a');
        $todo   = Product::sansImage()->reject(fn ($p) => glob($dir.'/'.$p->id.'.*'));
        if ($limit = (int) $this->option('limit')) {
            $todo = $todo->take($limit);
        }

        $ok = 0;
        foreach ($todo as $p) {
            [$found, $img] = $this->find($p);

            if ($img && ($bin = Http::timeout(30)->get($img['url']))->ok() && ($info = @getimagesizeFromString($bin->body()))) {
                $ext = [IMAGETYPE_JPEG => 'jpg', IMAGETYPE_PNG => 'png', IMAGETYPE_WEBP => 'webp'][$info[2]] ?? null;
                if ($ext) {
                    file_put_contents("$dir/{$p->id}.$ext", $bin->body());
                    $ok++;
                }
            }

            fputcsv($report, [$p->id, $p->nom, $p->marque, $img && ($ext ?? null) ? 'OK' : 'ABSENT', $img['brand'] ?? '', $img['name'] ?? ''], ';');
            $this->line(($img ? 'OK     ' : 'absent ').$p->id.' '.$p->nom);
        }

        $this->info("$ok photos téléchargées sur {$todo->count()} produits → $dir (voir report.csv)");

        return self::SUCCESS;
    }

    private function find(Product $p): array
    {
        $mots = array_filter(explode('-', Str::slug($p->nom)));
        $essais = $this->option('souple') ? [$p->nom, $p->sous_categorie] : [trim($p->nom.' '.$p->marque), $p->nom];
        foreach (array_filter(array_unique($essais)) as $q) {
            usleep(6_500_000); // Open Beauty Facts demande ~10 recherches/minute max

            $r = Http::timeout(30)->withUserAgent('QueenCosmetics-import/1.0')->get('https://world.openbeautyfacts.org/cgi/search.pl', [
                'search_simple' => 1, 'action' => 'process', 'json' => 1, 'page_size' => 10,
                'fields' => 'product_name,brands,image_front_url', 'search_terms' => $q,
            ]);

            foreach ($r->json('products') ?? [] as $x) {
                $slug = Str::slug($x['product_name'] ?? '');
                // Marque connue des deux côtés : elles doivent se contenir (« LOreal » ⊂ « L'OREAL NORGE AS »)
                $norm   = fn ($s) => preg_replace('/[^a-z0-9]/', '', Str::lower(Str::ascii((string) $s)));
                $marque = $norm($p->marque);
                $brand  = $norm($x['brands'] ?? '');
                $ok     = ! $marque || ! $brand || str_contains($brand, $marque) || str_contains($marque, $brand);

                $souple = $this->option('souple');

                if (! empty($x['image_front_url']) && ($souple || ($ok && ! array_diff($mots, explode('-', $slug))))) {
                    return [true, ['url' => $x['image_front_url'], 'brand' => $x['brands'] ?? '', 'name' => $x['product_name'] ?? '']];
                }
            }
        }

        return [false, null];
    }
}
