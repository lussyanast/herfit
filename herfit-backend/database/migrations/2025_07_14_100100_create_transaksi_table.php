<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('transaksi', function (Blueprint $table) {
            $table->increments('id_transaksi');
            $table->string('kode_transaksi', 10)->unique();
            $table->unsignedInteger('id_pengguna');
            $table->unsignedInteger('id_produk');
            $table->date('tanggal_mulai');
            $table->date('tanggal_selesai');
            $table->unsignedTinyInteger('jumlah_hari');
            $table->unsignedInteger('jumlah_bayar');
            $table->enum('status_transaksi', ['waiting', 'approved', 'rejected']);
            $table->string('bukti_pembayaran', 150)->nullable();
            $table->string('kode_qr', 150)->nullable();
            $table->timestamps();

            $table->foreign('id_pengguna')->references('id_pengguna')->on('pengguna');
            $table->foreign('id_produk')->references('id_produk')->on('produk');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transaksi');
    }
};
