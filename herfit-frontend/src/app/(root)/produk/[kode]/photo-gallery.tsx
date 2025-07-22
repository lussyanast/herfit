"use client";

import Image from "next/image";
import React from "react";

function PhotoGallery({ photos }: { photos: string[] }) {
  const getFullUrl = (path: string) =>
    `${process.env.NEXT_PUBLIC_STORAGE_BASE_URL}/storage/${path}`;

  if (!photos || photos.length === 0) {
    return (
      <div className="w-full h-[300px] bg-gray-100 flex items-center justify-center rounded-[20px]">
        <p className="text-muted-foreground text-sm">Belum ada foto tersedia.</p>
      </div>
    );
  }

  return (
    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {/* Foto utama besar */}
      <div className="col-span-1 sm:col-span-2 lg:col-span-2 xl:col-span-3 relative w-full">
        <Image
          src={photos[0] ? getFullUrl(photos[0]) : "/images/no-image.png"}
          alt="Foto utama produk"
          height={0}
          width={0}
          className="w-full h-[280px] sm:h-[350px] md:h-[450px] xl:h-[520px] rounded-[20px] object-cover"
          unoptimized
        />

        {/* Jika nanti ingin aktifkan button virtual tour */}
        {/* 
        <div className="absolute bottom-5 right-5">
          <Button className="flex" variant="third">
            <Image
              src="/icons/direct-right.svg"
              alt="direct-right"
              height={24}
              width={24}
              className="mr-2.5"
            />
            Start Virtual Tour
          </Button>
        </div> 
        */}
      </div>

      {/* Foto kecil tambahan */}
      {photos.length > 1 && (
        <div className="flex flex-col gap-4">
          {photos.slice(1, 4).map((photo, i) => (
            <Image
              key={i}
              src={getFullUrl(photo)}
              alt={`Foto tambahan ${i + 2}`}
              height={0}
              width={0}
              className="w-full h-[120px] sm:h-[140px] md:h-[160px] rounded-[16px] object-cover"
              unoptimized
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default PhotoGallery;