"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import moment from "moment";
import Image from "next/image";
import Breadcrumbs from "@/components/molecules/breadcrumbs";
import CardBooking from "@/components/molecules/card/card-booking";
import { Button } from "@/components/atomics/button";
import { Separator } from "@/components/atomics/separator";
import { Checkbox } from "@/components/atomics/checkbox";
import { DatePickerDemo } from "@/components/molecules/date-picker";
import Listing from "./listing";
import { useGetDetailListingQuery } from "@/services/listing.service";
import { moneyFormat } from "@/lib/utils";
import { useTransactionMutation } from "@/services/transaction.service";
import { useToast } from "@/components/atomics/use-toast";

function Checkout({ params }: { params: { id: string } }) {
  const { data: listing } = useGetDetailListingQuery(params.id);
  const searchParams = useSearchParams();
  const [transaction, { isLoading }] = useTransactionMutation();
  const { toast } = useToast();
  const router = useRouter();

  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [totalDays, setTotalDays] = useState<number>(0);

  useEffect(() => {
    const start = searchParams.get("start_date");
    const end = searchParams.get("end_date");

    if (start) setStartDate(moment(start, "YY-MM-DD").toDate());
    if (end) setEndDate(moment(end, "YY-MM-DD").toDate());
  }, [searchParams]);

  useEffect(() => {
    if (startDate && endDate) {
      const start = moment(startDate);
      const end = moment(endDate);
      const days = end.diff(start, "days");
      setTotalDays(days > 0 ? days : 0);
    }
  }, [startDate, endDate]);

  const price = listing?.data?.price ?? 0;

  const handlePayment = async () => {
    try {
      const data = {
        listing_id: listing.data.id,
        start_date: moment(startDate).format("YYYY-MM-DD"),
        end_date: moment(endDate).format("YYYY-MM-DD"),
      };

      const res = await transaction(data).unwrap();

      if (res.success) {
        router.push(`/booking-success/${res.data.id}/success`);
      }
    } catch (error: any) {
      toast({
        title: "Something went wrong.",
        description: error.data?.message ?? "Failed to create transaction.",
        variant: "destructive",
      });
    }
  };

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
              Informasi pesanan
            </h1>
            <div className="rounded-[30px] mt-2.5 p-[30px] bg-white border border-border shadow-indicator space-y-5">
              <div className="space-y-5">
                <DatePickerDemo
                  placeholder="Start Date"
                  date={startDate}
                  setDate={setStartDate}
                />
                <DatePickerDemo
                  placeholder="End Date"
                  date={endDate}
                  setDate={setEndDate}
                />
              </div>
              <div className="space-y-5">
                <CardBooking title="Total hari" value={`${totalDays} hari`} />
                <CardBooking
                  title="Grand total harga"
                  value={moneyFormat.format(price)}
                />
              </div>
            </div>
          </div>

          <div className="mt-[30px]">
            <h1 className="font-bold text-[22px] leading-[33px] text-secondary">
              Pembayaran
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
              <CardBooking title="Bank Name" value="HerFit" />
              <CardBooking title="Bank Account" value="HerFit Listings" />
              <CardBooking title="Number" value="20193050" />
              <Separator className="bg-border" />
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" />
                <label
                  htmlFor="terms"
                  className="text-sm font-semibold leading-[21px] peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Saya setuju dengan syarat dan ketentuan
                </label>
              </div>

              <Button
                variant="default"
                size="default"
                className="mt-4"
                onClick={handlePayment}
                disabled={isLoading}
              >
                Buat pesanan
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Checkout;