<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('produits')) {
            Schema::create('produits', function (Blueprint $table) {
                $table->id();
                $table->string('nom', 100);
                $table->string('categorie', 50)->nullable();
                $table->decimal('prix', 10, 2);
                $table->unsignedInteger('quantite_stock')->default(0);
                $table->string('image', 255)->nullable();
                $table->unsignedTinyInteger('promotion')->default(0);
            });
        } elseif (! Schema::hasColumn('produits', 'promotion')) {
            Schema::table('produits', fn (Blueprint $t) => $t->unsignedTinyInteger('promotion')->default(0));
        }

        if (! Schema::hasTable('publicites')) {
            Schema::create('publicites', function (Blueprint $table) {
                $table->id();
                $table->string('titre', 100);
                $table->string('image', 255)->nullable();
                $table->unsignedTinyInteger('reduction')->default(0);
                $table->foreignId('produit_id')->nullable()->constrained('produits')->nullOnDelete();
            });
        } elseif (! Schema::hasColumn('publicites', 'produit_id')) {
            Schema::table('publicites', fn (Blueprint $t) => $t->unsignedBigInteger('produit_id')->nullable());
        }

        if (! Schema::hasTable('commandes')) {
            Schema::create('commandes', function (Blueprint $table) {
                $table->id();
                $table->foreignId('client_id')->constrained('utilisateurs')->restrictOnDelete();
                $table->timestamp('date_commande')->useCurrent();
                $table->decimal('total', 10, 2);
                $table->enum('statut', ['En attente', 'Acceptee', 'Refusee', 'Livree'])->default('En attente');
                $table->string('nom_livraison', 100)->nullable();
                $table->string('telephone', 20)->nullable();
                $table->string('ville', 80)->nullable();
                $table->string('adresse', 255)->nullable();
                $table->string('statut_vu', 20)->nullable();
            });
        } else {
            $cols = [
                'nom_livraison' => fn (Blueprint $t) => $t->string('nom_livraison', 100)->nullable(),
                'telephone'     => fn (Blueprint $t) => $t->string('telephone', 20)->nullable(),
                'ville'         => fn (Blueprint $t) => $t->string('ville', 80)->nullable(),
                'adresse'       => fn (Blueprint $t) => $t->string('adresse', 255)->nullable(),
                'statut_vu'     => fn (Blueprint $t) => $t->string('statut_vu', 20)->nullable(),
            ];
            foreach ($cols as $name => $def) {
                if (! Schema::hasColumn('commandes', $name)) {
                    Schema::table('commandes', $def);
                }
            }
        }

        if (! Schema::hasTable('details_commandes')) {
            Schema::create('details_commandes', function (Blueprint $table) {
                $table->id();
                $table->foreignId('commande_id')->constrained('commandes')->cascadeOnDelete();
                $table->foreignId('produit_id')->constrained('produits')->restrictOnDelete();
                $table->unsignedInteger('quantite');
                $table->decimal('prix_unitaire', 10, 2);
            });
        }

        if (! Schema::hasTable('paiements')) {
            Schema::create('paiements', function (Blueprint $table) {
                $table->id();
                $table->foreignId('commande_id')->constrained('commandes')->cascadeOnDelete();
                $table->decimal('montant', 10, 2);
                $table->string('methode', 30)->default('Livraison');
                $table->enum('statut', ['Non paye', 'Paye'])->default('Non paye');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('paiements');
        Schema::dropIfExists('details_commandes');
        Schema::dropIfExists('commandes');
        Schema::dropIfExists('publicites');
        Schema::dropIfExists('produits');
    }
};
