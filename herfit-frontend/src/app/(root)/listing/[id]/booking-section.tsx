import { Button } from "@/components/atomics/button";
import Title from "@/components/atomics/title";
import CardBooking from "@/components/molecules/card/card-booking";
import { DatePickerDemo } from "@/components/molecules/date-picker";
import { moneyFormat } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import moment from 'moment';

interface BookingSectionProps {
  id: string;
  price: number;
}

function BookingSection({ id, price }: BookingSectionProps) {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [totalDays, setTotalDays] = useState<number>(0);

  // Fungsi untuk menghitung jumlah hari antara startDate dan endDate
  useEffect(() => {
    if (startDate && endDate) {
      const start = moment(startDate);
      const end = moment(endDate);
      const daysDifference = end.diff(start, "days");
      setTotalDays(daysDifference);
    }
  }, [startDate, endDate]);

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
      <Link href={`/listing/${id}/checkout`}>
        <Button variant="default" className="mt-4">
          Pesan Sekarang
        </Button>
      </Link>
    </div>
  );
}

export default BookingSection;