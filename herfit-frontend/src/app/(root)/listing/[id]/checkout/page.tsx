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
import { useToast } from "@/components/atomics/use-toast";

function Checkout({ params }: { params: { id: string } }) {
  const { data: listing } = useGetDetailListingQuery(params.id);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [totalDays, setTotalDays] = useState<number>(0);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const start = searchParams.get("start_date");
    const end = searchParams.get("end_date");
    if (start) setStartDate(moment(start, "YY-MM-DD").toDate());
    if (end) setEndDate(moment(end, "YY-MM-DD").toDate());
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
    if (!startDate || !endDate || !proofFile) {
      toast({
        title: "Validasi Gagal",
        description: "Tanggal dan bukti bayar harus diisi.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;

      // 1. Buat transaksi
      const res = await fetch(`${apiBase}/transaction`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listing_id: listing?.data?.id,
          start_date: moment(startDate).format("YYYY-MM-DD"),
          end_date: moment(endDate).format("YYYY-MM-DD"),
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      const transactionId = data.data.id;

      // 2. Upload bukti bayar
      const formData = new FormData();
      formData.append("bukti_bayar", proofFile);

      const upload = await fetch(`${apiBase}/transaction/${transactionId}/upload-bukti`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
        },
        body: formData,
      });

      const uploadData = await upload.json();
      if (!uploadData.success) throw new Error(uploadData.message);

      // 3. Redirect ke halaman sukses
      router.push(`/booking-success/${transactionId}/success`);
    } catch (err: any) {
      toast({
        title: "Gagal",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const price = listing?.data?.price ?? 0;

  return (
    <main>
      <section id="breadcrumb-section" className="bg-gray-light pt-[170px] pb-[178px]">
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
              <DatePickerDemo placeholder="Start Date" date={startDate} setDate={setStartDate} />
              <DatePickerDemo placeholder="End Date" date={endDate} setDate={setEndDate} />
              <CardBooking title="Total hari" value={`${totalDays} hari`} />
              <CardBooking title="Grand total harga" value={moneyFormat.format(price)} />
            </div>
          </div>

          <div className="mt-[30px]">
            <h1 className="font-bold text-[22px] leading-[33px] text-secondary">Pembayaran</h1>
            <div className="rounded-[30px] mt-2.5 p-[30px] bg-white border border-border shadow-indicator space-y-5">
              <div className="flex items-center space-x-3">
                <Button variant="third" size="button" className="w-1/2 border-2 border-gray-light hover:border-primary">
                  <Image src="/icons/card.svg" alt="card" height={24} width={24} className="mr-2.5" />
                  Transfer
                </Button>
                <Button variant="third" size="button" className="w-1/2 border-2 border-gray-light hover:border-primary">
                  <Image src="/icons/visa.svg" alt="visa" height={0} width={0} className="h-full w-auto" />
                </Button>
              </div>

              <CardBooking title="Bank Name" value="HerFit" />
              <CardBooking title="Bank Account" value="HerFit Listings" />
              <CardBooking title="Number" value="20193050" />
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
                  className="block w-full text-sm text-gray-500
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
                {isLoading ? "Memproses..." : "Buat pesanan"}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Checkout;