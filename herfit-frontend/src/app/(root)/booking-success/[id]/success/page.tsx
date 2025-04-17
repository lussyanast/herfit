"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";

import { useGetDetailTransactionQuery } from "@/services/transaction.service";
import { Transaction } from "@/interfaces/transaction";

import { Badge } from "@/components/atomics/badge";
import { Button } from "@/components/atomics/button";
import { Separator } from "@/components/atomics/separator";

function BookingSuccess({ params }: { params: { id: string } }) {
  const { data } = useGetDetailTransactionQuery(params.id);
  const booking: Transaction = useMemo(() => data?.data, [data]);

  return (
    <main>
      {/* Hero Title */}
      <section className="bg-gray-light pt-[190px] pb-[148px]">
        <div className="container mx-auto flex items-center justify-center">
          <h1 className="max-w-[360px] font-bold text-[32px] text-center leading-[48px] text-secondary">
            Pemesanan Berhasil 🎉
          </h1>
        </div>
      </section>

      {/* Card Section */}
      <section className="container mx-auto -mt-[98px] max-w-[650px] mb-[150px] space-y-5 rounded-[30px] bg-white border border-border shadow-indicator p-[30px]">
        {/* Detail Pemesanan */}
        <div className="flex items-center space-x-6">
          {booking?.listing?.attachments?.[0] && (
            <Image
              src={`${process.env.NEXT_PUBLIC_STORAGE_BASE_URL}/${booking.listing.attachments[0]}`}
              alt="Foto Tempat"
              width={180}
              height={130}
              className="rounded-[28px] object-cover"
              unoptimized
            />
          )}
          <div className="space-y-2.5">
            <h2 className="font-bold text-[22px] leading-[33px] text-secondary">
              {booking?.listing?.title}
            </h2>
            <Badge variant="secondary">{booking?.status}</Badge>
          </div>
        </div>

        {/* Info Tambahan */}
        <div className="flex items-center font-semibold leading-6">
          <Image
            src="/icons/profile-2user-dark.svg"
            alt="Jumlah Orang"
            width={20}
            height={20}
            className="mr-1"
          />
          {booking?.listing?.max_person} Orang
        </div>

        <Separator className="bg-border" />

        {/* Form Konfirmasi WhatsApp */}
        <section className="mt-10 rounded-[20px] border border-border bg-white p-6 shadow-sm">
          <h3 className="text-xl font-bold mb-3 text-secondary text-center">
            Konfirmasi Pembayaran
          </h3>
          <p className="text-muted-foreground text-center mb-6">
            Setelah melakukan pembayaran, silakan konfirmasi dan lampirkan bukti pembayaran melalui WhatsApp agar pemesananmu segera diproses.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const name = (document.getElementById("name") as HTMLInputElement).value;
              const message = (document.getElementById("message") as HTMLTextAreaElement).value;
              const text = `Halo, saya ${name}. Saya ingin mengonfirmasi pembayaran untuk pemesanan "${booking?.listing?.title}".\nPesan: ${message}`;
              const encodedText = encodeURIComponent(text);
              window.open(`https://wa.me/6282261291606?text=${encodedText}`, "_blank");
            }}
            className="max-w-xl mx-auto space-y-4"
          >
            <div>
              <label htmlFor="name" className="block text-sm font-semibold mb-1">
                Nama
              </label>
              <input
                type="text"
                id="name"
                required
                className="w-full rounded-md border border-gray-400 px-3 py-2 shadow-sm focus:border-primary focus:ring-primary text-sm"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-semibold mb-1">
                Pesan
              </label>
              <textarea
                id="message"
                required
                rows={3}
                className="w-full rounded-md border border-gray-400 px-3 py-2 shadow-sm focus:border-primary focus:ring-primary text-sm"
              />
            </div>

            <div className="text-center">
              <Button type="submit" variant="default" size="header">
                Konfirmasi via WhatsApp
              </Button>
            </div>
          </form>
        </section>

        {/* Aksi */}
        <div className="mt-5 flex flex-wrap justify-center gap-2.5">
          <Link href="/">
            <Button
              variant="third"
              size="header"
              className="w-full sm:w-auto sm:min-w-[180.5px]"
            >
              Jelajahi Lagi
            </Button>
          </Link>

          <Link href="/dashboard/overview">
            <Button
              variant="third"
              size="header"
              className="w-full sm:w-auto sm:min-w-[180.5px]"
            >
              Ke Dashboard
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}

export default BookingSuccess;