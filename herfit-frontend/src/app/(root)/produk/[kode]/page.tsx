"use client";

import Breadcrumbs from "@/components/molecules/breadcrumbs";
import Title from "@/components/atomics/title";
import Image from "next/image";
import ListingShowcase from "@/components/molecules/listing/listing-showcase";
import PhotoGallery from "./photo-gallery";
import BookingSection from "./booking-section";
import { useGetDetailProdukQuery } from "@/services/produk.service";
import { useMemo } from "react";
import { Produk } from "@/interfaces/produk";

function Detail({ params }: { params: { kode: string } }) {
  const { data } = useGetDetailProdukQuery(params.kode);
  const produk: Produk | undefined = useMemo(() => data?.data, [data]);

  const fotoArray: string[] =
    produk?.foto_produk?.includes(",")
      ? produk.foto_produk
        .split(",")
        .map((item) => `${process.env.NEXT_PUBLIC_STORAGE_BASE_URL}/${item.trim()}`)
      : produk?.foto_produk
        ? [`${process.env.NEXT_PUBLIC_STORAGE_BASE_URL}/${produk.foto_produk}`]
        : [];

  return (
    <main>
      {/* SECTION: HERO */}
      <section id="overview-section" className="bg-gray-light pt-[170px] pb-[50px]">
        <div className="px-6 xl:container xl:mx-auto">
          <Breadcrumbs />

          {fotoArray.length > 0 && <PhotoGallery photos={fotoArray} />}

          <div className="mt-[30px] grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-x-6">
            <div className="col-span-2 xl:col-span-3 space-y-5">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                <h1 className="font-bold text-[28px] xl:text-[32px] leading-tight text-secondary">
                  {produk?.nama_produk ?? "Nama produk tidak tersedia"}
                </h1>
                <div className="flex items-center font-semibold text-muted-foreground text-sm">
                  <Image
                    src="/icons/profile-2user-dark.svg"
                    alt="max"
                    width={20}
                    height={20}
                    className="mr-2"
                  />
                  Maksimal {produk?.maksimum_peserta ?? "-"} peserta
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: BOOKING */}
      <section
        id="about-booking-section"
        className="px-6 xl:container xl:mx-auto py-[50px] flex flex-col lg:flex-row space-y-10 lg:space-y-0 lg:space-x-[60px]"
      >
        <div className="w-full max-w-[650px] space-y-[30px]">
          <Title
            section="detail"
            title="Deskripsi"
            subtitle={produk?.deskripsi_produk ?? "Tidak ada deskripsi tersedia."}
          />
        </div>

        {produk && (
          <BookingSection
            id={produk.id_produk}
            kode={produk.kode_produk}
            price={produk.harga_produk}
          />
        )}
      </section>

      {/* SECTION: LAINNYA */}
      <ListingShowcase
        id="deals-section"
        title="Lihat produk lainnya"
        subtitle="Rekomendasi produk kami untuk kamu"
        category="others"
      />
    </main>
  );
}

export default Detail;