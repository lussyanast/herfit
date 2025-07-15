import { Produk as ProdukInterface } from "@/interfaces/produk";
import Image from "next/image";
import React from "react";

function Produk({ produk }: { produk: ProdukInterface }) {
  const fotoUtama = produk.foto_produk
    ? produk.foto_produk.includes(",")
      ? produk.foto_produk.split(",")[0]
      : produk.foto_produk
    : null;

  return (
    <div className="w-full max-w-[460px] h-fit p-[30px] space-y-5 bg-white rounded-[30px] shadow-indicator border border-border">
      {fotoUtama && (
        <Image
          src={`${process.env.NEXT_PUBLIC_STORAGE_BASE_URL}/${fotoUtama}`}
          alt="produk-image"
          height={0}
          width={0}
          className="w-full h-[220px] rounded-[30px] object-cover"
          unoptimized
        />
      )}

      <h1 className="font-bold text-[22px] leading-[33px] text-secondary">
        {produk.nama_produk}
      </h1>

      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center font-semibold leading-6">
            <Image
              src="/icons/profile-2user-dark.svg"
              alt="icon"
              height={0}
              width={0}
              className="w-5 h-5 mr-1"
            />
            {produk.maksimum_peserta ?? "-"}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Produk;
