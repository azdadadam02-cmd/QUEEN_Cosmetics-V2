<?php

namespace App\Console\Commands;

use App\Models\Product;
use Illuminate\Console\Command;
use Illuminate\Support\Str;

class ImportProductImages extends Command
{
    protected $signature = 'products:import-images {dir? : dossier des images} {--list : affiche id;nom des produits sans image}';
    protected $description = 'Importe en masse les images des produits depuis un dossier';

    public function handle(): int
    {
        $sans = Product::sansImage();

        if ($this->option('list')) {
            $sans->each(fn ($p) => $this->line($p->id.';'.$p->nom));

            return self::SUCCESS;
        }

        $dir = $this->argument('dir');
        if (! $dir || ! is_dir($dir)) {
            $this->error('Dossier introuvable : indique le dossier des images.');

            return self::FAILURE;
        }

        $cible = [];
        foreach ($sans as $p) {
            $cible[(string) $p->id] = $p;
            $cible[Str::slug($p->nom)] ??= $p;
        }

        $fait = $orphelins = 0;
        $fait_ids = [];
        foreach (glob(rtrim($dir, '/\\').'/*.{jpg,jpeg,png,webp,gif,JPG,JPEG,PNG,WEBP,GIF}', GLOB_BRACE) as $f) {
            $cle = pathinfo($f, PATHINFO_FILENAME);
            $p   = $cible[$cle] ?? $cible[Str::slug($cle)] ?? null;

            if (! $p || isset($fait_ids[$p->id]) || ! @getimagesize($f)) {
                $orphelins++;
                $this->warn('Ignoré : '.basename($f));

                continue;
            }

            $name = Str::limit(Str::slug($p->nom) ?: 'image', 40, '').'-'.$p->id.'.'.strtolower(pathinfo($f, PATHINFO_EXTENSION));
            copy($f, public_path('images/'.$name));
            $p->update(['image' => $name]);
            $fait_ids[$p->id] = true;
            $fait++;
        }

        $reste = Product::sansImage()->count();
        $this->info("$fait images importées, $orphelins fichiers ignorés, $reste produits sans image.");

        return self::SUCCESS;
    }
}
