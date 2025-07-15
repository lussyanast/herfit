import { apiSlice } from "./base-query";

export const transactionApi = apiSlice.injectEndpoints({
    endpoints: (build) => ({
        checkAvailability: build.mutation({
            query: (payload) => ({
                url: "/transaksi/is-available",
                method: "POST",
                body: payload,
            }),
        }),
        transaction: build.mutation({
            query: (payload) => ({
                url: "/transaksi",
                method: "POST",
                body: payload,
            }),
        }),
        getTransactions: build.query({
            query: () => ({
                url: "/transaksi",
                method: "GET",
            }),
        }),
        getDetailTransaction: build.query({
            query: (id) => ({
                url: `/transaksi/${id}`,
                method: "GET",
            }),
        }),
    }),
});

export const {
    useCheckAvailabilityMutation,
    useTransactionMutation,
    useGetTransactionsQuery,
    useGetDetailTransactionQuery,
} = transactionApi;
