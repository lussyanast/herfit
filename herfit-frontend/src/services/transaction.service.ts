import { apiSlice } from "./apiSlice";

export const transactionApi = apiSlice.injectEndpoints({
    endpoints: (build) => ({
        checkAvailability: build.mutation<
            { success: boolean; message: string },
            { id_produk: number; tanggal_mulai: string; tanggal_selesai: string }
        >({
            query: (payload) => ({
                url: "/transaksi/is-available",
                method: "POST",
                body: payload,
            }),
        }),

        transaction: build.mutation<
            any,
            { id_produk: number; tanggal_mulai: string; tanggal_selesai: string }
        >({
            query: (payload) => ({
                url: "/transaksi",
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ["Transaction"],
        }),

        getTransactions: build.query<any, void>({
            query: () => ({ url: "/transaksi", method: "GET" }),
            providesTags: ["Transaction"],
        }),

        getDetailTransaction: build.query<any, string>({
            query: (kode) => ({ url: `/transaksi/kode/${kode}`, method: "GET" }),
        }),
    }),
});

export const {
    useCheckAvailabilityMutation,
    useTransactionMutation,
    useGetTransactionsQuery,
    useGetDetailTransactionQuery,
} = transactionApi;