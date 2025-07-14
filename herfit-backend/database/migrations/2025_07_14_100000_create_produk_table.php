<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('produk', function (Blueprint $table) {
            $table->increments('id_produk');
            $table->string('kode_produk', 6)->unique();
            $table->string('nama_produk', 30);
            $table->string('kategori_produk', 15);
            $table->text('deskripsi_produk')->nullable();
            $table->integer('maksimum_peserta')->nullable()->default(3);
            $table->unsignedInteger('harga_produk');
            $table->string('foto_produk', 150)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('produk');
    }
};
