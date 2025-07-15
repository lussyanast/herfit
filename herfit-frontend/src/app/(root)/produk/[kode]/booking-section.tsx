"use client";

import { Button } from "@/components/atomics/button";
import CardBooking from "@/components/molecules/card/card-booking";
import { DatePickerDemo } from "@/components/molecules/date-picker";
import { moneyFormat } from "@/lib/utils";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import moment from "moment";
import { useCheckAvailabilityMutation } from "@/services/transaction.service";
import { useToast } from "@/components/atomics/use-toast";
import { useRouter } from "next/navigation";

interface BookingSectionProps {
  id: number;
  kode: string;
  price: number;
}

function BookingSection({ id, kode, price }: BookingSectionProps) {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [totalDays, setTotalDays] = useState<number>(0);

  const { toast } = useToast();
  const router = useRouter();
  const [checkAvailability, { isLoading }] = useCheckAvailabilityMutation();

  useEffect(() => {
    if (startDate && endDate) {
      const start = moment(startDate);
      const end = moment(endDate);
      const daysDifference = end.diff(start, "days");
      setTotalDays(daysDifference > 0 ? daysDifference : 0);
    }
  }, [startDate, endDate]);

  const handleBook = async () => {
    if (!startDate || !endDate || totalDays <= 0) {
      toast({
        title: "Tanggal tidak valid",
        description: "Silakan pilih tanggal mulai dan akhir yang benar",
        variant: "destructive",
      });
      return;
    }

    try {
      const data = {
        id_produk: id,
        tanggal_mulai: moment(startDate).format("YYYY-MM-DD"),
        tanggal_selesai: moment(endDate).format("YYYY-MM-DD"),
      };

      const res = await checkAvailability(data).unwrap();

      if (res.success) {
        // Simpan ke localStorage (jika dibutuhkan di checkout)
        localStorage.setItem("tanggal_mulai", data.tanggal_mulai);
        localStorage.setItem("tanggal_selesai", data.tanggal_selesai);

        router.push(
          `/produk/${kode}/checkout?start_date=${data.tanggal_mulai}&end_date=${data.tanggal_selesai}`
        );
      }
    } catch (error: any) {
      if (error.status === 401) {
        toast({
          title: "Tidak dapat melanjutkan",
          description: "Silakan login terlebih dahulu",
          variant: "destructive",
          action: (
            <Link href={`/sign-in?callbackUrl=${window.location.href}`}>
              Sign in
            </Link>
          ),
        });
      } else if (error.status === 404) {
        toast({
          title: "Produk tidak ditemukan",
          description: error?.data?.message || "Data tidak tersedia",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Terjadi kesalahan",
          description: "Silakan coba lagi nanti",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="w-full max-w-[360px] xl:max-w-[400px] h-fit space-y-5 bg-white border border-border rounded-[20px] p-[30px] shadow-indicator">
      <span className="leading-6">
        <span className="font-bold text-4xl leading-[54px]">
          {moneyFormat.format(price)}
        </span>
      </span>
      <div className="space-y-5">
        <DatePickerDemo placeholder="Start Date" date={startDate} setDate={setStartDate} />
        <DatePickerDemo placeholder="End Date" date={endDate} setDate={setEndDate} />
      </div>
      <div className="space-y-5">
        <CardBooking title="Total hari" value={`${totalDays} hari`} />
      </div>
      <Button variant="default" className="mt-4" onClick={handleBook} disabled={isLoading}>
        {isLoading ? "Memeriksa..." : "Pesan Sekarang"}
      </Button>
    </div>
  );
}

export default BookingSection;