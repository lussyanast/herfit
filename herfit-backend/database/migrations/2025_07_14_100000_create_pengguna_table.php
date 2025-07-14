<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pengguna', function (Blueprint $table) {
            $table->increments('id_pengguna');
            $table->enum('peran_pengguna', ['admin', 'member'])->default('member');
            $table->string('nama_lengkap', 50);
            $table->string('email', 30)->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('kata_sandi', 60);
            $table->string('no_identitas', 16)->nullable();
            $table->string('no_telp', 15)->nullable();
            $table->string('foto_profil', 150)->nullable();
            $table->rememberToken();
            $table->timestamps();
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email', 30)->primary();
            $table->string('token', 100);
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id_session')->primary();
            $table->integer('id_pengguna')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('agent_pengguna')->nullable();
            $table->longText('payload');
            $table->integer('aktivitas_terakhir')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('pengguna');
    }
};
