<?php

namespace Database\Seeders;

use App\Models\Advertisement;
use App\Models\Product;
use App\Models\PromoAnnouncement;
use App\Models\Usp;
use App\Models\User;
use Illuminate\Database\Seeder;

/**
 * php artisan migrate --seed
 * Comptes de test (mot de passe pour tous : Queen2026) — ne remplace jamais un compte existant.
 */
class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $comptes = [
            ['Administrateur QUEEN', 'admin@queen.ma', 'admin'],
            ['Responsable Produits', 'produits@queen.ma', 'responsable_produits'],
            ['Responsable Commandes', 'commandes@queen.ma', 'responsable_commandes'],
            ['Client Test', 'client@queen.ma', 'client'],
        ];
        foreach ($comptes as [$nom, $email, $role]) {
            User::firstOrCreate(['email' => $email], ['nom' => $nom, 'mot_de_passe' => 'Queen2026', 'role' => $role]);
        }

        if (Usp::count() === 0) {
            foreach ([
                ['truck', 'Livraison partout au Maroc'],
                ['check', 'Paiement à la livraison'],
                ['mail', 'Inscrivez-vous pour nos offres exclusives'],
                ['gift', 'Gagnez des points QUEEN'],
            ] as $i => [$icone, $texte]) {
                Usp::create(['icone' => $icone, 'texte' => $texte, 'ordre_affichage' => $i + 1, 'est_actif' => true]);
            }
        }
        if (PromoAnnouncement::count() === 0) {
            PromoAnnouncement::create(['texte' => "Jusqu'à -75 % sur la sélection Black Friday", 'couleur_fond' => '#725A65', 'couleur_texte' => '#FFFFFF', 'est_actif' => true]);
        }

        if (Product::count() > 0) {
            return;   // queen_db déjà remplie : on ne touche pas au catalogue
        }

        $produits = [
            ['Parfum Rose Royale', 'Parfums', 450, 12, 'parfum-rose-69e49c2f.webp', 0],
            ['Crème Visage Éclat', 'Soins', 220, 8, 'creme-visage-84f07733.webp', 10],
            ['Rouge à Lèvres Velours', 'Maquillage', 120, 25, 'rouge-a-levres-49730228.webp', 0],
            ['Mascara Volume Queen', 'Maquillage', 95, 3, 'mascara-67b77147.webp', 0],
            ['Sérum Nuit Précieux', 'Soins', 310, 0, null, 0],
        ];
        $ids = [];
        foreach ($produits as [$nom, $cat, $prix, $stock, $img, $promo]) {
            $ids[$nom] = Product::create([
                'nom' => $nom, 'categorie' => $cat, 'prix' => $prix,
                'quantite_stock' => $stock, 'image' => $img, 'promotion' => $promo,
            ])->id;
        }

        Advertisement::create(['titre' => 'Des promotions exceptionnelles', 'reduction' => 30, 'image' => 'queen-des-promotions-execeptionnelles-to-32f59de2.webp']);
        Advertisement::create(['titre' => 'Offre parfums', 'reduction' => 20, 'image' => 'queen-offre-parfums-e4561299.webp', 'produit_id' => $ids['Parfum Rose Royale']]);
        Advertisement::create(['titre' => 'Promotion maquillage', 'reduction' => 0, 'image' => 'queen-promotion-maquillage-8072d798.webp']);
    }
}
