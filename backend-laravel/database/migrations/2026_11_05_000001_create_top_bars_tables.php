<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Barres au-dessus de la navbar (même schéma que Database.TEXT) :
 *  - usps           : barre des avantages (livraison, -15 %, …)
 *  - annonces_promo : barre promotionnelle (texte + compte à rebours optionnel)
 * Ne touche pas aux tables existantes.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('usps')) {
            Schema::create('usps', function (Blueprint $table) {
                $table->id();
                $table->string('icone', 100)->nullable();
                $table->string('texte', 255);
                $table->string('lien', 255)->nullable();
                $table->integer('ordre_affichage')->default(0);
                $table->boolean('est_actif')->default(true);
            });
        }

        if (! Schema::hasTable('annonces_promo')) {
            Schema::create('annonces_promo', function (Blueprint $table) {
                $table->id();
                $table->string('texte', 255);
                $table->string('lien', 255)->nullable();
                $table->string('couleur_fond', 20)->default('#000000');
                $table->string('couleur_texte', 20)->default('#FFFFFF');
                $table->dateTime('date_debut')->nullable();
                $table->dateTime('date_fin')->nullable();
                $table->boolean('est_actif')->default(false);
            });
        }

        if (! Schema::hasTable('parametres_header')) {
            Schema::create('parametres_header', function (Blueprint $table) {
                $table->id();
                $table->string('nom_marque', 150)->default('QUEEN-Cosmetics');
                $table->string('couleur_fond', 20)->default('#000000');
                $table->string('couleur_texte', 20)->default('#D4AF37');
                $table->boolean('est_actif')->default(true);
            });
        }

        // Avis clients : visibles seulement après validation de l'admin (est_approuve)
        if (! Schema::hasTable('avis_produits')) {
            Schema::create('avis_produits', function (Blueprint $table) {
                $table->id();
                $table->integer('produit_id');
                $table->integer('utilisateur_id');
                $table->integer('note');
                $table->text('commentaire')->nullable();
                $table->boolean('est_approuve')->default(false);
                $table->dateTime('date_avis')->useCurrent();
                $table->unique(['produit_id', 'utilisateur_id']);
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('avis_produits');
        Schema::dropIfExists('parametres_header');
        Schema::dropIfExists('annonces_promo');
        Schema::dropIfExists('usps');
    }
};
