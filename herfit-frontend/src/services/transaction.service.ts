// services/transaction.service.ts
import { apiSlice } from "./base-query";

export const transactionApi = apiSlice.injectEndpoints({
    endpoints: (build) => ({
        // POST /transaksi/is-available
        checkAvailability: build.mutation<
            any,
            { payload: { id_produk: number; tanggal_mulai: string; tanggal_selesai: string }; token: string }
        >({
            query: ({ payload, token }) => ({
                url: "/transaksi/is-available",
                method: "POST",
                body: payload,
                headers: { Authorization: `Bearer ${token}` },
            }),
        }),

        // POST /transaksi  (buat pesanan)
        transaction: build.mutation<
            any,
            {
                payload: {
                    id_produk: number;
                    tanggal_mulai: string;
                    tanggal_selesai: string;
                    jumlah_hari: number;
                    jumlah_bayar: number;
                };
                token: string;
            }
        >({
            query: ({ payload, token }) => ({
                url: "/transaksi",
                method: "POST",
                body: payload,
                headers: { Authorization: `Bearer ${token}` },
            }),
        }),

        // POST /transaksi/:id/upload-bukti  (upload bukti bayar)
        uploadProof: build.mutation<any, { id: number | string; formData: FormData; token: string }>({
            query: ({ id, formData, token }) => ({
                url: `/transaksi/${id}/upload-bukti`,
                method: "POST",
                body: formData,
                headers: { Authorization: `Bearer ${token}` },
            }),
        }),

        // GET /transaksi (list transaksi milik user)
        getTransactions: build.query<any, { token: string }>({
            query: ({ token }) => ({
                url: "/transaksi",
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            }),
        }),

        // GET /transaksi/kode/:kode (detail transaksi)
        getDetailTransaction: build.query<any, { kode: string; token: string }>({
            query: ({ kode, token }) => ({
                url: `/transaksi/kode/${kode}`,
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            }),
        }),
    }),
});

export const {
    useCheckAvailabilityMutation,
    useTransactionMutation,
    useUploadProofMutation,
    useGetTransactionsQuery,
    useGetDetailTransactionQuery,
} = transactionApi;