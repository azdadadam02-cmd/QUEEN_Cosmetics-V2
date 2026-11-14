<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/** Prix propre à une variante (50 ml ≠ 100 ml). Vide = prix du produit : les variantes existantes ne changent pas. */
return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('variantes_produits', 'prix')) {
            Schema::table('variantes_produits', fn (Blueprint $t) => $t->decimal('prix', 10, 2)->nullable()->after('quantite_pieces'));
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('variantes_produits', 'prix')) {
            Schema::table('variantes_produits', fn (Blueprint $t) => $t->dropColumn('prix'));
        }
    }
};
