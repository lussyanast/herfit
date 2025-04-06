"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import moment from "moment";
import Image from "next/image";
import Breadcrumbs from "@/components/molecules/breadcrumbs";
import CardBooking from "@/components/molecules/card/card-booking";
import { Button } from "@/components/atomics/button";
import { Separator } from "@/components/atomics/separator";
import { Checkbox } from "@/components/atomics/checkbox";
import { DatePickerDemo } from "@/components/molecules/date-picker";
import Link from "next/link";
import Listing from "./listing";
import Review from "./review";
import { useGetDetailListingQuery } from "@/services/listing.service";
import { moneyFormat } from "@/lib/utils";

function Checkout({ params }: { params: { id: string } }) {
  const { data: listing } = useGetDetailListingQuery(params.id);
  const searchParams = useSearchParams();

  const [checkInDate, setCheckInDate] = useState<Date>();
  const [checkOutDate, setCheckOutDate] = useState<Date>();
  const [totalDays, setTotalDays] = useState<number>(0);

  useEffect(() => {
    const start = searchParams.get("start_date");
    const end = searchParams.get("end_date");

    if (start) setCheckInDate(moment(start, "YY-MM-DD").toDate());
    if (end) setCheckOutDate(moment(end, "YY-MM-DD").toDate());
  }, [searchParams]);

  useEffect(() => {
    if (checkInDate && checkOutDate) {
      const start = moment(checkInDate);
      const end = moment(checkOutDate);
      const days = end.diff(start, "days");
      setTotalDays(days > 0 ? days : 0);
    }
  }, [checkInDate, checkOutDate]);

  const price = listing?.data?.price ?? 0;
  const grandTotal = price * totalDays;

  return (
    <main>
      <section
        id="breadcrumb-section"
        className="bg-gray-light pt-[170px] pb-[178px]"
      >
        <div className="container mx-auto">
          <Breadcrumbs />
        </div>
      </section>

      <section
        id="booking-information-section"
        className="container mx-auto flex space-x-[50px] -mt-[148px]"
      >
        {listing && <Listing listing={listing.data} />}

        <div className="w-full max-w-[460px] pt-[50px]">
          <div>
            <h1 className="font-bold text-[22px] leading-[33px] text-secondary">
              Booking Informations
            </h1>
            <div className="rounded-[30px] mt-2.5 p-[30px] bg-white border border-border shadow-indicator space-y-5">
              <div className="space-y-5">
                <DatePickerDemo
                  placeholder="Start Date"
                  date={checkInDate}
                  setDate={setCheckInDate}
                />
                <DatePickerDemo
                  placeholder="End Date"
                  date={checkOutDate}
                  setDate={setCheckOutDate}
                />
              </div>
              <div className="space-y-5">
                <CardBooking title="Total hari" value={`${totalDays} hari`} />
                <CardBooking title="Grand total price" value={moneyFormat.format(price)} />
              </div>
            </div>
          </div>

          <div className="mt-[30px]">
            <h1 className="font-bold text-[22px] leading-[33px] text-secondary">
              Payment
            </h1>
            <div className="rounded-[30px] mt-2.5 p-[30px] bg-white border border-border shadow-indicator space-y-5">
              <div className="flex items-center space-x-3">
                <Button
                  variant="third"
                  size="button"
                  className="w-1/2 border-2 border-gray-light hover:border-primary"
                >
                  <Image
                    src="/icons/card.svg"
                    alt="card"
                    height={24}
                    width={24}
                    className="mr-2.5"
                  />
                  Transfer
                </Button>
                <Button
                  variant="third"
                  size="button"
                  className="w-1/2 border-2 border-gray-light hover:border-primary"
                >
                  <Image
                    src="/icons/visa.svg"
                    alt="visa"
                    height={0}
                    width={0}
                    className="h-full w-auto"
                  />
                </Button>
              </div>
              <CardBooking title="Bank Name" value="BuildWithAngga Fi" />
              <CardBooking title="Bank Account" value="Nidejia Listings" />
              <CardBooking title="Number" value="20193050" />
              <Separator className="bg-border" />
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" />
                <label
                  htmlFor="terms"
                  className="text-sm font-semibold leading-[21px] peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I agree with terms & conditions
                </label>
              </div>
              <Link href={`/booking-success/12321aa12/success`}>
                <Button variant="default" size="default" className="mt-4">
                  Make a Payment
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <Review />
    </main>
  );
}

export default Checkout;