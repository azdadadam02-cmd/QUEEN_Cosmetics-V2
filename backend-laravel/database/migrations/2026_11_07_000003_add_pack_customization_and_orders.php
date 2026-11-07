<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Packs : personnalisation de la carte (couleurs, texte du bouton) et lien commande → pack.
 * Les tables peuvent déjà exister (import SQL) : chaque ajout est gardé.
 */
return new class extends Migration
{
    private function ref(Blueprint $table, string $column, string $target, bool $nullable = false): void
    {
        $col = Schema::getColumnType($target, 'id') === 'bigint' ? $table->unsignedBigInteger($column) : $table->integer($column);
        if ($nullable) {
            $col->nullable();
        }
    }

    public function up(): void
    {
        if (! Schema::hasTable('packs')) {
            Schema::create('packs', function (Blueprint $table) {
                $table->id();
                $table->string('nom', 150);
                $table->text('description')->nullable();
                $table->string('image', 255)->nullable();
                $table->decimal('prix_promo', 10, 2);
                $table->boolean('est_actif')->default(true);
                $table->dateTime('date_creation')->useCurrent();
            });
        }

        if (! Schema::hasTable('pack_produit')) {
            Schema::create('pack_produit', function (Blueprint $table) {
                $table->id();
                $this->ref($table, 'pack_id', 'packs');
                $this->ref($table, 'produit_id', 'produits');
                $table->integer('quantite')->default(1);
                $table->foreign('pack_id')->references('id')->on('packs')->cascadeOnDelete();
                $table->foreign('produit_id')->references('id')->on('produits')->cascadeOnDelete();
            });
        }

        Schema::table('packs', function (Blueprint $table) {
            if (! Schema::hasColumn('packs', 'couleur_fond')) {
                $table->string('couleur_fond', 20)->default('#735A65');
            }
            if (! Schema::hasColumn('packs', 'couleur_texte')) {
                $table->string('couleur_texte', 20)->default('#FFFFFF');
            }
            if (! Schema::hasColumn('packs', 'texte_bouton')) {
                $table->string('texte_bouton', 40)->default('Voir le pack');
            }
        });

        if (! Schema::hasColumn('details_commandes', 'pack_id')) {
            Schema::table('details_commandes', function (Blueprint $table) {
                $this->ref($table, 'pack_id', 'packs', true);
                $table->foreign('pack_id')->references('id')->on('packs')->nullOnDelete();
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('details_commandes', 'pack_id')) {
            Schema::table('details_commandes', function (Blueprint $table) {
                $table->dropForeign(['pack_id']);
                $table->dropColumn('pack_id');
            });
        }
        Schema::table('packs', function (Blueprint $table) {
            $table->dropColumn(['couleur_fond', 'couleur_texte', 'texte_bouton']);
        });
    }
};
