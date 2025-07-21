"use client";

import React, { useEffect, useState } from "react";
import Title from "@/components/atomics/title";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/atomics/carousel";
import CardDeals from "@/components/molecules/card/card-deals";
import axios from "@/lib/axios";

interface Produk {
  id_produk: number;
  kode_produk: string;
  nama_produk: string;
  harga_produk: number;
  kategori_produk: string;
  foto_produk: string | null;
}

interface ListingShowcaseProps {
  id: string;
  title: string;
  subtitle: string;
  category?: string;
}

const ListingShowcase = ({ id, title, subtitle, category }: ListingShowcaseProps) => {
  const [produkList, setProdukList] = useState<Produk[]>([]);

  useEffect(() => {
    const fetchProduk = async () => {
      try {
        const res = await axios.get("/produk");
        setProdukList(res.data?.data || []);
      } catch (err) {
        console.error("Gagal memuat data produk", err);
      }
    };

    fetchProduk();
  }, []);

  const filtered = produkList.filter((item) => {
    if (category === "membership") {
      return item.kategori_produk?.toLowerCase() === "membership";
    } else if (category === "others") {
      return item.kategori_produk?.toLowerCase() !== "membership";
    }
    return true;
  });

  return (
    <section id={id} className="px-10 xl:container xl:mx-auto pt-16 pb-[100px]">
      <div className="flex justify-center text-center">
        <Title title={title} subtitle={subtitle} />
      </div>
      <Carousel className="w-full mt-[30px]">
        <CarouselContent>
          {filtered.map((item) => (
            <CarouselItem key={item.id_produk} className="basis-1/4">
              <CardDeals
                image={
                  item.foto_produk
                    ? `${process.env.NEXT_PUBLIC_STORAGE_BASE_URL}/${item.foto_produk}`
                    : "/images/no-image.png"
                }
                title={item.nama_produk}
                slug={`/produk/${item.kode_produk}`}
                price={item.harga_produk}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
};

export default ListingShowcase;
