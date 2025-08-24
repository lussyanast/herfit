"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import moment from "moment";
import Image from "next/image";
import Breadcrumbs from "@/components/molecules/breadcrumbs";
import CardBooking from "@/components/molecules/card/card-booking";
import { Button } from "@/components/atomics/button";
import { Separator } from "@/components/atomics/separator";
import { DatePickerDemo } from "@/components/molecules/date-picker";
import Produk from "./produk";
import { useGetDetailProdukQuery } from "@/services/produk.service";
import { moneyFormat } from "@/lib/utils";
import { useToast } from "@/components/atomics/use-toast";
import { useSession } from "next-auth/react";  // ⬅️ ambil token dari sini
import {
  useTransactionMutation,
  useUploadProofMutation,
} from "@/services/transaction.service"; // ⬅️ mutation baru

function Checkout({ params }: { params: { kode: string } }) {
  const { data: produk } = useGetDetailProdukQuery(params.kode);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  const { data: session } = useSession();
  const token = session?.user?.token ?? ""; // ⬅️ token aktif

  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [totalDays, setTotalDays] = useState<number>(0);
  const [proofFile, setProofFile] = useState<File | null>(null);

  const [createTransaction, { isLoading: isCreating }] = useTransactionMutation();
  const [uploadProof, { isLoading: isUploading }] = useUploadProofMutation();

  useEffect(() => {
    const start = searchParams.get("start_date");
    const end = searchParams.get("end_date");
    if (start) setStartDate(moment(start, "YYYY-MM-DD").toDate());
    if (end) setEndDate(moment(end, "YYYY-MM-DD").toDate());
  }, [searchParams]);

  useEffect(() => {
    if (startDate && endDate) {
      const days = moment(endDate).diff(moment(startDate), "days");
      setTotalDays(days > 0 ? days : 0);
    }
  }, [startDate, endDate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setProofFile(e.target.files[0]);
  };

  const handlePayment = async () => {
    if (!produk?.data?.id_produk || !startDate || !endDate || !proofFile || totalDays <= 0) {
      toast({
        title: "Validasi Gagal",
        description: "Tanggal, produk, dan bukti pembayaran wajib diisi.",
        variant: "destructive",
      });
      return;
    }

    try {
      const payload = {
        id_produk: produk.data.id_produk,
        // kalau backend cukup date-only, pakai YYYY-MM-DD
        tanggal_mulai: moment(startDate).format("YYYY-MM-DD"),
        tanggal_selesai: moment(endDate).format("YYYY-MM-DD"),
        jumlah_hari: totalDays,
        jumlah_bayar: produk.data.harga_produk,
      };

      // 1) Buat transaksi
      const trx = await createTransaction({ payload, token }).unwrap();
      const transactionId = trx?.data?.id_transaksi;
      const kodeTransaksi = trx?.data?.kode_transaksi;

      if (!transactionId) throw new Error("ID transaksi tidak ditemukan.");

      // 2) Upload bukti
      const formData = new FormData();
      formData.append("bukti_bayar", proofFile);

      const up = await uploadProof({ id: transactionId, formData, token }).unwrap();
      if (!up?.success) throw new Error(up?.message || "Upload bukti gagal.");

      // 3) Sukses → redirect
      router.push(`/booking-success/${kodeTransaksi}/success`);
    } catch (err: any) {
      toast({
        title: "Gagal",
        description: err?.data?.message || err?.message || "Terjadi kesalahan.",
        variant: "destructive",
      });
    }
  };

  const price = produk?.data?.harga_produk ?? 0;
  const isLoading = isCreating || isUploading;

  return (
    <main className="bg-gray-50 pb-20">
      {/* Header */}
      <section className="bg-gray-light pt-[170px] pb-[180px]">
        <div className="container mx-auto px-4 sm:px-6">
          <Breadcrumbs />
        </div>
      </section>

      {/* Isi */}
      <section className="container mx-auto px-4 sm:px-6 -mt-[140px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10">
          {/* Produk */}
          <div className="lg:col-span-5">
            {produk?.data && <Produk produk={produk.data} />}
          </div>

          {/* Form Booking */}
          <div className="lg:col-span-7">
            <div className="space-y-10">
              <div>
                <h2 className="font-bold text-xl sm:text-2xl text-secondary mb-3">Informasi Pesanan</h2>
                <div className="rounded-[20px] bg-white p-6 border border-border shadow space-y-5">
                  <DatePickerDemo placeholder="Tanggal Mulai" date={startDate} setDate={setStartDate} />
                  <DatePickerDemo placeholder="Tanggal Selesai" date={endDate} setDate={setEndDate} />
                  <CardBooking title="Total Hari" value={`${totalDays} hari`} />
                  <CardBooking title="Total Harga" value={moneyFormat.format(price)} />
                </div>
              </div>

              <div>
                <h2 className="font-bold text-xl sm:text-2xl text-secondary mb-3">Pembayaran</h2>
                <div className="rounded-[20px] bg-white p-6 border border-border shadow space-y-5">
                  <div className="space-y-2 text-sm font-medium">
                    <CardBooking title="Bank" value="Bank Mandiri" />
                    <CardBooking title="Atas Nama" value="Lussy Triana" />
                    <CardBooking title="No. Rekening" value="1670004852314" />
                  </div>

                  <Separator className="bg-border" />

                  <div>
                    <label htmlFor="proof" className="block font-semibold text-sm mb-2">
                      Upload Bukti Pembayaran
                    </label>
                    <input
                      type="file"
                      id="proof"
                      accept="image/*,application/pdf"
                      onChange={handleFileChange}
                      className="block w-full text-sm text-gray-600
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-primary file:text-white
                        hover:file:bg-primary/90"
                    />
                    {proofFile && (
                      <p className="text-sm mt-1 text-green-600">{proofFile.name} siap diunggah.</p>
                    )}
                  </div>

                  <Button
                    variant="default"
                    size="default"
                    className="w-full"
                    onClick={handlePayment}
                    disabled={isLoading}
                  >
                    {isLoading ? "Memproses..." : "Buat Pesanan"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Checkout;