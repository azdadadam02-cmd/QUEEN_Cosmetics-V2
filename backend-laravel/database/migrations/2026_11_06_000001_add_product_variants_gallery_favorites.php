<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private function ref(Blueprint $table, string $column, string $target): void
    {
        Schema::getColumnType($target, 'id') === 'bigint' ? $table->unsignedBigInteger($column) : $table->integer($column);
    }

    public function up(): void
    {
        Schema::table('produits', function (Blueprint $table) {
            foreach (['sous_categorie' => 100, 'marque' => 100, 'tranche_age' => 50] as $column => $length) {
                if (! Schema::hasColumn('produits', $column)) {
                    $table->string($column, $length)->nullable();
                }
            }
            if (! Schema::hasColumn('produits', 'details')) {
                $table->text('details')->nullable();
            }
        });

        if (! Schema::hasTable('variantes_produits')) {
            Schema::create('variantes_produits', function (Blueprint $table) {
                $table->id();
                $this->ref($table, 'produit_id', 'produits');
                $table->string('sku', 100)->nullable()->unique();
                $table->string('couleur', 50)->nullable();
                $table->string('taille', 20)->nullable();
                $table->integer('volume_ml')->nullable();
                $table->integer('poids_g')->nullable();
                $table->integer('quantite_pieces')->nullable();
                $table->integer('quantite_stock')->default(0);
                $table->foreign('produit_id')->references('id')->on('produits')->cascadeOnDelete();
            });
        }

        if (! Schema::hasTable('images_produits')) {
            Schema::create('images_produits', function (Blueprint $table) {
                $table->id();
                $this->ref($table, 'produit_id', 'produits');
                $table->string('chemin_image', 255);
                $table->boolean('est_principale')->default(false);
                $table->integer('ordre_affichage')->default(0);
                $table->foreign('produit_id')->references('id')->on('produits')->cascadeOnDelete();
            });
        }

        if (! Schema::hasTable('favoris')) {
            Schema::create('favoris', function (Blueprint $table) {
                $table->id();
                $this->ref($table, 'utilisateur_id', 'utilisateurs');
                $this->ref($table, 'produit_id', 'produits');
                $table->dateTime('date_ajout')->useCurrent();
                $table->unique(['utilisateur_id', 'produit_id']);
                $table->foreign('utilisateur_id')->references('id')->on('utilisateurs')->cascadeOnDelete();
                $table->foreign('produit_id')->references('id')->on('produits')->cascadeOnDelete();
            });
        }

        if (! Schema::hasColumn('details_commandes', 'variante_id')) {
            Schema::table('details_commandes', function (Blueprint $table) {
                Schema::getColumnType('variantes_produits', 'id') === 'bigint'
                    ? $table->unsignedBigInteger('variante_id')->nullable()->after('produit_id')
                    : $table->integer('variante_id')->nullable()->after('produit_id');
                $table->foreign('variante_id')->references('id')->on('variantes_produits')->nullOnDelete();
            });
        }
    }

    /** Ne supprime que la colonne de commande : les tables peuvent venir de l'import SQL */
    public function down(): void
    {
        if (Schema::hasColumn('details_commandes', 'variante_id')) {
            Schema::table('details_commandes', function (Blueprint $table) {
                $table->dropForeign(['variante_id']);
                $table->dropColumn('variante_id');
            });
        }
    }
};
