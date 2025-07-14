<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('interaksi', function (Blueprint $table) {
            $table->increments('id_interaksi');
            $table->unsignedInteger('id_pengguna');
            $table->unsignedInteger('id_postingan');
            $table->enum('jenis_interaksi', ['like', 'komentar']);
            $table->text('isi_komentar')->nullable();
            $table->timestamp('waktu_interaksi');

            $table->foreign('id_pengguna')->references('id_pengguna')->on('pengguna');
            $table->foreign('id_postingan')->references('id_postingan')->on('postingan');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('interaksi');
    }
};
