<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('reclamations')) {
            return;
        }
        Schema::create('reclamations', function (Blueprint $table) {
            $table->id();
            Schema::getColumnType('utilisateurs', 'id') === 'bigint' ? $table->unsignedBigInteger('utilisateur_id')->nullable() : $table->integer('utilisateur_id')->nullable();
            $table->string('sujet', 150);
            $table->text('message');
            $table->enum('statut', ['Ouvert', 'En cours', 'Resolu'])->default('Ouvert');
            $table->dateTime('date_reclamation')->useCurrent();
            $table->foreign('utilisateur_id')->references('id')->on('utilisateurs')->nullOnDelete();
        });
    }

    public function down(): void
    {
    }
};
