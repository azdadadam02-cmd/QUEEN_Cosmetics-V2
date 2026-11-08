<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/** Corbeille des produits : « supprime_le » rempli = produit masqué mais récupérable. */
return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('produits', 'supprime_le')) {
            Schema::table('produits', fn (Blueprint $table) => $table->timestamp('supprime_le')->nullable());
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('produits', 'supprime_le')) {
            Schema::table('produits', fn (Blueprint $table) => $table->dropColumn('supprime_le'));
        }
    }
};
