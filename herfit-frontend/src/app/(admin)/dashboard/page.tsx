"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import CardTransaction from "@/components/molecules/card/card-transaction";
import CardEmpty from "@/components/molecules/card/card-empty";
import Title from "@/components/atomics/title";

function Dashboard() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
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
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/transaksi`, {
            headers: {
              Authorization: `Bearer ${session.user.token}`,
            },
          }),
        ]);

        const profileData = await profileRes.json();
        const transData = await transRes.json();

        if (profileRes.ok) setProfile(profileData.data);

        if (transRes.ok && transData?.data) {
          const list = Array.isArray(transData.data)
            ? transData.data
            : Array.isArray(transData.data.data)
              ? transData.data.data
              : [];
          setTransactions(list.slice(0, 3));
        }
      } catch (err) {
        console.error("Gagal memuat data dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session]);

  return (
    <main className="pb-20">
      <div className="flex flex-col sm:flex-row items-start justify-between sm:items-center gap-3">
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
          <div className="mt-8 p-6 rounded-2xl bg-white shadow-md space-y-6">
            <h2 className="text-xl font-semibold text-secondary border-b pb-2">
              Data Pribadi
            </h2>
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <Image
                src={
                  profile?.foto_profil
                    ? `${process.env.NEXT_PUBLIC_STORAGE_BASE_URL}/${profile.foto_profil}`
                    : "/images/avatar.png"
                }
                alt="Foto Profil"
                width={100}
                height={100}
                className="rounded-full object-cover border shadow shrink-0"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4 w-full text-sm">
                <div>
                  <p className="text-gray-500">Nama</p>
                  <p className="font-medium break-words">{profile?.nama_lengkap || "-"}</p>
                </div>
                <div>
                  <p className="text-gray-500">Email</p>
                  <p className="font-medium break-words">{profile?.email || "-"}</p>
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
          <div className="mt-10">
            <h2 className="text-lg font-bold text-secondary mb-3">
              Riwayat Transaksi Terbaru
            </h2>
            <div className="space-y-5">
              {transactions.length > 0 ? (
                transactions.map((transaction: any) => (
                  <CardTransaction
                    id={transaction.id}
                    key={transaction.kode_transaksi}
                    kode={transaction.kode_transaksi}
                    image={
                      transaction.produk?.foto_produk
                        ? `${process.env.NEXT_PUBLIC_STORAGE_BASE_URL}/${transaction.produk.foto_produk}`
                        : "/images/default.png"
                    }
                    title={transaction.produk?.nama_produk || "Tanpa Nama"}
                    days={transaction.jumlah_hari}
                    price={transaction.jumlah_bayar}
                    status={transaction.status_transaksi}
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