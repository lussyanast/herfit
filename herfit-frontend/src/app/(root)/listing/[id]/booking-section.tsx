import { Button } from "@/components/atomics/button";
import Title from "@/components/atomics/title";
import CardBooking from "@/components/molecules/card/card-booking";
import { DatePickerDemo } from "@/components/molecules/date-picker";
import { moneyFormat } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import moment from 'moment';
import { useCheckAvailabilityMutation } from "@/services/transaction.service";
import { useToast } from "@/components/atomics/use-toast";

interface BookingSectionProps {
  id: number;
  price: number;
}

function BookingSection({ id, price }: BookingSectionProps) {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [totalDays, setTotalDays] = useState<number>(0);

  const { toast } = useToast();
  const [checkAvailability, { isLoading }] = useCheckAvailabilityMutation();

  // Fungsi untuk menghitung jumlah hari antara startDate dan endDate
  useEffect(() => {
    if (startDate && endDate) {
      const start = moment(startDate);
      const end = moment(endDate);
      const daysDifference = end.diff(start, "days");
      setTotalDays(daysDifference);
    }
  }, [startDate, endDate]);

  const handleBook = async () => {
    // `/listing/${id}/checkout`
    try {
      const data = {
        listing_id: id,
        start_date: moment(startDate).format("YY-MM-DD"),
        end_date: moment(endDate).format("YY-MM-DD"),
      };

      const res = await checkAvailability(data).unwrap();
      console.log("~ handleBook ~ res:", res);
    } catch (error: any) {
      if (error.status === 401) {
        toast({
          title: "Something went wrong",
          description: "Silahkan login terlebih dahulu",
          variant: "destructive",
          action: (
            <Link href={`/sign-in?callbackUrl=${window.location.href}`}>
              Sign in
            </Link>
          )
        });
      } else if (error.status === 404) {
        toast({
          title: "Something went wrong",
          description: error.data.message,
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="w-full max-w-[360px] xl:max-w-[400px] h-fit space-y-5 bg-white border border-border rounded-[20px] p-[30px] shadow-indicator">
      <span className="leading-6">
        <span className="font-bold text-4xl leading-[54px]">{moneyFormat.format(price)}</span>
      </span>
      <div className="space-y-5">
        <DatePickerDemo placeholder="Start Date" date={startDate} setDate={setStartDate} />
        <DatePickerDemo placeholder="End Date" date={endDate} setDate={setEndDate} />
      </div>
      <div className="space-y-5">
        <CardBooking title="Total hari" value={`${totalDays} hari`} />
      </div>
      <Button variant="default" className="mt-4" onClick={handleBook} disabled={isLoading}>
        Pesan Sekarang
      </Button>
    </div>
  );
}

export default BookingSection;