<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('aktivitas', function (Blueprint $table) {
            $table->increments('id_aktivitas');
            $table->unsignedInteger('id_pengguna');
            $table->enum('jenis_aktivitas', ['latihan', 'makanan']);
            $table->string('nama_aktivitas', 30);
            $table->unsignedSmallInteger('kalori')->nullable();
            $table->unsignedTinyInteger('durasi')->nullable();
            $table->json('jadwal')->nullable();
            $table->date('tanggal');
            $table->timestamps();

            $table->foreign('id_pengguna')->references('id_pengguna')->on('pengguna');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('aktivitas');
    }
};
