"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import CardTransaction from "@/components/molecules/card/card-transaction";
import CardEmpty from "@/components/molecules/card/card-empty";
import Title from "@/components/atomics/title";
import { Transaction } from "@/interfaces/transaction";

function Dashboard() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<any>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user?.token) return;

      try {
        const [profileRes, transRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user`, {
            headers: {
              Authorization: `Bearer ${session.user.token}`,
            },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/transaction`, {
            headers: {
              Authorization: `Bearer ${session.user.token}`,
            },
          }),
        ]);

        const profileData = await profileRes.json();
        const transData = await transRes.json();

        if (profileRes.ok) setProfile(profileData.data);
        if (transRes.ok) setTransactions(transData.data.data.slice(0, 3));
      } catch (err) {
        console.error("Gagal memuat data overview", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session]);

  return (
    <main>
      <div className="flex items-center justify-between">
        <Title
          section="admin"
          title="Dashboard"
          subtitle="Data pribadi dan transaksi terakhir Anda"
        />
      </div>

      {loading ? (
        <p className="text-sm text-gray-500 mt-6">Memuat data...</p>
      ) : (
        <>
          {/* Data Pribadi */}
          <div className="mt-[30px] p-6 rounded-2xl bg-white shadow-md space-y-4">
            <h2 className="text-xl font-semibold text-secondary border-b pb-2">Data Pribadi</h2>
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <Image
                src={
                  profile?.photo_profile
                    ? `${process.env.NEXT_PUBLIC_STORAGE_BASE_URL}/${profile.photo_profile}`
                    : "/images/avatar.png"
                }
                alt="Foto Profil"
                width={100}
                height={100}
                className="rounded-full object-cover border shadow"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-3 w-full text-sm">
                <div>
                  <p className="text-gray-500">Nama</p>
                  <p className="font-medium">{profile?.name || "-"}</p>
                </div>
                <div>
                  <p className="text-gray-500">Email</p>
                  <p className="font-medium">{profile?.email || "-"}</p>
                </div>
                <div>
                  <p className="text-gray-500">NIK</p>
                  <p className="font-medium">{profile?.no_identitas || "-"}</p>
                </div>
                <div>
                  <p className="text-gray-500">No Telp</p>
                  <p className="font-medium">{profile?.no_telp || "-"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Riwayat Transaksi */}
          <div className="mt-[30px]">
            <h1 className="font-bold text-lg leading-[27px] text-secondary mb-3">
              Riwayat Transaksi Terbaru
            </h1>
            <div className="space-y-5">
              {transactions.length > 0 ? (
                transactions.map((transaction: Transaction) => (
                  <CardTransaction
                    key={transaction.id}
                    id={transaction.id}
                    image={transaction.listing?.attachments?.[0] || ""}
                    title={transaction.listing?.listing_name || "Tanpa Nama"}
                    days={transaction.total_days}
                    price={transaction.price}
                    status={transaction.status}
                  />
                ))
              ) : (
                <CardEmpty />
              )}
            </div>
          </div>
        </>
      )}
    </main>
  );
}

export default Dashboard;