"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useGetDetailTransactionQuery } from "@/services/transaction.service";
import { Transaction } from "@/interfaces/transaction";
import { Button } from "@/components/atomics/button";
import { Separator } from "@/components/atomics/separator";

function BookingSuccess({ params }: { params: { kode: string } }) {
  const { data, isLoading, error } = useGetDetailTransactionQuery(params.kode);
  const booking: Transaction | undefined = useMemo(() => data?.data, [data]);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gray-light pt-[190px] pb-[148px]">
        <div className="container mx-auto text-center">
          <h1 className="font-bold text-[32px] leading-[48px] text-secondary">
            Pemesanan Berhasil 🎉
          </h1>
          <p className="mt-2 text-muted-foreground text-sm">
            {isLoading
              ? "Memuat detail transaksi..."
              : error
                ? "Terjadi kesalahan saat memuat data transaksi."
                : "Detail transaksi dan QR tersedia di bawah."}
          </p>
        </div>
      </section>

      {/* Isi */}
      <section className="container mx-auto -mt-[100px] max-w-[700px] mb-[100px] rounded-[30px] bg-white border border-border shadow-indicator p-[30px]">
        {!booking ? (
          <p className="text-center text-muted-foreground">Data transaksi tidak ditemukan.</p>
        ) : (
          <>
            {/* QR Code */}
            {booking.qr_code_url && (
              <div className="text-center mb-10">
                <h3 className="text-lg font-semibold text-secondary mb-3">QR Code Pemesanan</h3>
                <div className="inline-block p-4 bg-white border rounded-xl shadow-md">
                  <img
                    src={booking.qr_code_url}
                    alt="QR Code"
                    className="mx-auto w-48 h-48"
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-3">
                  Tunjukkan QR ini saat check-in
                </p>
                <div className="mt-4 text-xs text-muted-foreground max-w-md mx-auto bg-yellow-50 border border-yellow-200 px-4 py-3 rounded-lg">
                  <ul className="list-disc pl-5 space-y-1 text-left">
                    <li>
                      <span className="font-medium text-yellow-800">QR hanya dapat digunakan jika status transaksi adalah <span className="font-semibold text-green-700">approved</span>.</span>
                    </li>
                    <li>
                      <span className="font-medium text-yellow-800">Jika status masih <span className="font-semibold text-yellow-700">waiting</span> atau <span className="font-semibold text-red-700">rejected</span>, maka QR tidak valid.</span>
                    </li>
                    <li>
                      <span className="font-medium text-yellow-800">QR hanya berlaku selama periode tanggal yang telah dipilih, yaitu <strong>{booking.tanggal_mulai}</strong> s.d. <strong>{booking.tanggal_selesai}</strong>.</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            <Separator className="my-6 bg-border" />

            {/* Detail Transaksi */}
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="grid grid-cols-[auto,1fr] gap-y-3 gap-x-4">
                <p className="font-semibold">Kode Transaksi</p>
                <p>{booking.kode_transaksi}</p>

                <p className="font-semibold">Produk</p>
                <p>{booking.produk?.nama_produk ?? "-"}</p>

                <p className="font-semibold">Tanggal</p>
                <p>{booking.tanggal_mulai} s.d. {booking.tanggal_selesai}</p>

                <p className="font-semibold">Total Hari</p>
                <p>{booking.jumlah_hari} hari</p>

                <p className="font-semibold">Total Bayar</p>
                <p>Rp {booking.jumlah_bayar.toLocaleString("id-ID")}</p>

                <p className="font-semibold">Status</p>
                <div>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold
                      ${booking.status_transaksi === "approved" ? "bg-green-100 text-green-700" :
                      booking.status_transaksi === "rejected" ? "bg-red-100 text-red-700" :
                        "bg-yellow-100 text-yellow-800"}
                    `}>
                    {booking.status_transaksi}
                  </span>
                </div>
              </div>
            </div>

            {/* Konfirmasi WhatsApp */}
            {booking.status_transaksi !== "approved" && (
              <section className="mt-10 rounded-[20px] border border-border bg-gray-50 p-6 shadow-sm">
                <h3 className="text-xl font-bold mb-3 text-secondary text-center">
                  Konfirmasi Pembayaran
                </h3>
                <p className="text-muted-foreground text-center mb-6">
                  Setelah pembayaran, silakan konfirmasi melalui WhatsApp.
                </p>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const name = (document.getElementById("name") as HTMLInputElement).value;
                    const message = (document.getElementById("message") as HTMLTextAreaElement).value;
                    const text = `Halo, saya ${name}. Saya ingin mengonfirmasi pembayaran untuk produk "${booking.produk?.nama_produk}".\nPesan: ${message}`;
                    const encodedText = encodeURIComponent(text);
                    window.open(`https://wa.me/6282261291606?text=${encodedText}`, "_blank");
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold mb-1">Nama</label>
                    <input
                      type="text"
                      id="name"
                      required
                      className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:ring-primary text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold mb-1">Pesan</label>
                    <textarea
                      id="message"
                      required
                      rows={3}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:ring-primary text-sm"
                    />
                  </div>

                  <div className="text-center pt-2">
                    <Button type="submit" variant="default" size="header">
                      Konfirmasi via WhatsApp
                    </Button>
                  </div>
                </form>
              </section>
            )}
          </>
        )}

        {/* Tombol Aksi */}
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link href="/">
            <Button variant="third" size="header" className="min-w-[160px]">
              Jelajahi Lagi
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="third" size="header" className="min-w-[160px]">
              Ke Dashboard
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}

export default BookingSuccess;