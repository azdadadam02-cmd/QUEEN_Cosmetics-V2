<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('utilisateurs')) {
            Schema::create('utilisateurs', function (Blueprint $table) {
                $table->id();
                $table->string('nom', 100);
                $table->string('email', 150)->unique();
                $table->string('mot_de_passe', 255);
                $table->enum('role', ['client', 'admin', 'responsable_produits', 'responsable_commandes'])->default('client');
            });
        }

        if (! Schema::hasTable('password_reset_tokens')) Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        if (! Schema::hasTable('sessions')) Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('utilisateurs');
    }
};
