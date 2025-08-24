"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useGetDetailTransactionQuery } from "@/services/transaction.service";
import { Button } from "@/components/atomics/button";
import { Separator } from "@/components/atomics/separator";

type Transaction = {
  kode_transaksi: string;
  status_transaksi: "pending" | "approved" | "rejected" | string;
  tanggal_mulai?: string;
  tanggal_selesai?: string;
  jumlah_hari?: number;
  jumlah_bayar?: number;
  qr_code_url?: string;
  produk?: {
    kategori_produk?: string;
    nama_produk?: string;
  };
};

export default function BookingSuccessPage({
  params,
}: {
  params: { kode: string };
}) {
  // ❗️Jika tidak pakai token:
  // const { data, isLoading, error } = useGetDetailTransactionQuery(params.kode);

  // ✅ Jika suatu saat perlu token, tinggal isi variabel token di sini
  const token: string | undefined = undefined;
  const { data, isLoading, error } = useGetDetailTransactionQuery(
    token ? { kode: params.kode, token } : params.kode
  );

  const booking: Transaction | undefined = useMemo(
    () => data?.data as Transaction | undefined,
    [data]
  );

  const statusApproved = booking?.status_transaksi === "approved";
  const isMembership = booking?.produk?.kategori_produk === "Membership";
  const qrAvailable = !!booking?.qr_code_url;

  const showQR = statusApproved && isMembership && qrAvailable;
  const showQRCodeBelumTersedia = !statusApproved && isMembership;
  const showKonfirmasiGym = !statusApproved && !isMembership;

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gray-light pt-[190px] pb-[148px]">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h1 className="font-bold text-[28px] sm:text-[32px] leading-[42px] sm:leading-[48px] text-secondary">
            Pemesanan Berhasil 🎉
          </h1>
          <p className="mt-2 text-muted-foreground text-sm">
            {isLoading
              ? "Memuat detail transaksi..."
              : error
                ? "Terjadi kesalahan saat memuat data transaksi."
                : "Detail transaksi tersedia di bawah."}
          </p>
        </div>
      </section>

      {/* Isi */}
      <section className="container mx-auto px-4 sm:px-6 -mt-[100px] mb-[100px]">
        <div className="max-w-[700px] mx-auto rounded-[20px] bg-white border border-border shadow-indicator p-6 sm:p-[30px]">
          {!booking ? (
            <p className="text-center text-muted-foreground">
              Data transaksi tidak ditemukan.
            </p>
          ) : (
            <>
              {/* QR Code Section */}
              {showQR ? (
                <div className="text-center mb-10">
                  <h3 className="text-lg font-semibold text-secondary mb-3">
                    QR Code Pemesanan
                  </h3>
                  <div className="inline-block p-4 bg-white border rounded-xl shadow-md">
                    {/* ✅ Non-null assertion aman karena sudah di-guard showQR */}
                    <Image
                      src={booking.qr_code_url!}
                      alt="QR Code"
                      width={192}
                      height={192}
                      className="mx-auto w-48 h-48"
                      unoptimized
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-3">
                    Tunjukkan QR ini saat check-in
                  </p>
                  <div className="mt-4 text-xs text-muted-foreground bg-yellow-50 border border-yellow-200 px-4 py-3 rounded-lg text-left">
                    <ul className="list-disc pl-5 space-y-1">
                      <li>
                        Berlaku dari <strong>{booking.tanggal_mulai}</strong>{" "}
                        sampai <strong>{booking.tanggal_selesai}</strong>.
                      </li>
                      <li>
                        Jangan bagikan QR ini ke pihak lain demi keamanan akun
                        Anda.
                      </li>
                    </ul>
                  </div>
                </div>
              ) : showQRCodeBelumTersedia ? (
                <div className="text-center mb-10">
                  <h3 className="text-lg font-semibold text-secondary mb-3">
                    QR Code Belum Tersedia
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    QR akan tampil setelah transaksi disetujui oleh admin.
                    Silakan cek kembali secara berkala melalui dashboard.
                  </p>
                </div>
              ) : showKonfirmasiGym ? (
                <div className="text-center mb-10">
                  <h3 className="text-lg font-semibold text-secondary mb-3">
                    Konfirmasi Admin
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Silakan konfirmasi pembayaran langsung kepada admin yang
                    bertugas di gym.
                  </p>
                </div>
              ) : null}

              <Separator className="my-6 bg-border" />

              {/* Detail Transaksi */}
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="grid grid-cols-[auto,1fr] gap-y-3 gap-x-4">
                  <p className="font-semibold">Kode Transaksi</p>
                  <p>{booking.kode_transaksi}</p>

                  <p className="font-semibold">Produk</p>
                  <p>{booking.produk?.nama_produk ?? "-"}</p>

                  <p className="font-semibold">Tanggal</p>
                  <p>
                    {booking.tanggal_mulai} s.d. {booking.tanggal_selesai}
                  </p>

                  <p className="font-semibold">Total Hari</p>
                  <p>{booking.jumlah_hari} hari</p>

                  <p className="font-semibold">Total Bayar</p>
                  <p>
                    Rp{" "}
                    {booking.jumlah_bayar?.toLocaleString("id-ID", {
                      maximumFractionDigits: 0,
                    }) ?? "-"}
                  </p>

                  <p className="font-semibold">Status</p>
                  <div>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold
                        ${booking.status_transaksi === "approved"
                          ? "bg-green-100 text-green-700"
                          : booking.status_transaksi === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                    >
                      {booking.status_transaksi}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Tombol Aksi */}
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/">
              <Button
                variant="third"
                size="header"
                className="min-w-[160px] w-full sm:w-auto"
              >
                Jelajahi Lagi
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button
                variant="third"
                size="header"
                className="min-w-[160px] w-full sm:w-auto"
              >
                Ke Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}