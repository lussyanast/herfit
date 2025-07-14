<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('postingan', function (Blueprint $table) {
            $table->increments('id_postingan');
            $table->unsignedInteger('id_pengguna');
            $table->text('caption');
            $table->string('foto_postingan', 150)->nullable();
            $table->timestamps();

            $table->foreign('id_pengguna')->references('id_pengguna')->on('pengguna');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('postingan');
    }
};
