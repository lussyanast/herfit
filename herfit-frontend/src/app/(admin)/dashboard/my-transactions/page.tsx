'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Title from '@/components/atomics/title';
import CardTransaction from '@/components/molecules/card/card-transaction';
import CardEmpty from '@/components/molecules/card/card-empty';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
} from '@/components/atomics/pagination';

function MyTransactions() {
  const { data: session } = useSession();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!session?.user?.token) return;

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/transaksi?page=${currentPage}`,
          {
            headers: {
              Authorization: `Bearer ${session.user.token}`,
            },
          }
        );

        const result = await res.json();

        if (res.ok) {
          setTransactions(result.data.data || []);
          setLastPage(result.data.last_page || 1);
        } else {
          console.error("Gagal memuat data:", result.message);
        }
      } catch (err) {
        console.error("Gagal memuat transaksi:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [session, currentPage]);

  const handlePageClick = (page: number) => {
    if (page !== currentPage) {
      setCurrentPage(page);
      setLoading(true);
    }
  };

  const renderPagination = () => {
    const pages = [];

    for (let i = 1; i <= lastPage; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink
            href="#"
            isActive={i === currentPage}
            onClick={() => handlePageClick(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return pages;
  };

  return (
    <main>
      <div className="flex items-center justify-between">
        <Title section="admin" title="Riwayat Transaksi" />
      </div>

      <div className="mt-[30px] space-y-5">
        {loading ? (
          <p className="text-sm text-gray-500">Memuat data transaksi...</p>
        ) : transactions.length > 0 ? (
          transactions.map((transaction: any) => (
            <CardTransaction
              key={transaction.id_transaksi}
              id={transaction.id_transaksi}
              image={
                transaction.produk?.foto_produk
                  ? `${process.env.NEXT_PUBLIC_STORAGE_BASE_URL}/${transaction.produk.foto_produk}`
                  : '/images/default.png'
              }
              title={transaction.produk?.nama_produk || 'Tanpa Nama'}
              days={transaction.jumlah_hari}
              price={transaction.jumlah_bayar}
              status={transaction.status_transaksi}
            />
          ))
        ) : (
          <CardEmpty />
        )}
      </div>

      {lastPage > 1 && (
        <Pagination className="mt-[30px]">
          <PaginationContent>{renderPagination()}</PaginationContent>
        </Pagination>
      )}
    </main>
  );
}

export default MyTransactions;
