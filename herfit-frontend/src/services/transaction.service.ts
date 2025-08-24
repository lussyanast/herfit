import { apiSlice } from "./base-query";

type GetDetailArg =
    | string
    | {
        kode: string;
        token?: string;
    };

export const transactionApi = apiSlice.injectEndpoints({
    endpoints: (build) => ({
        checkAvailability: build.mutation<any, unknown>({
            query: (payload) => ({
                url: "/transaksi/is-available",
                method: "POST",
                body: payload,
            }),
        }),

        transaction: build.mutation<any, unknown>({
            query: (payload) => ({
                url: "/transaksi",
                method: "POST",
                body: payload,
            }),
        }),

        getTransactions: build.query<any, void>({
            query: () => ({
                url: "/transaksi",
                method: "GET",
            }),
        }),

        getDetailTransaction: build.query<any, GetDetailArg>({
            query: (arg) => {
                const kode = typeof arg === "string" ? arg : arg.kode;
                const token = typeof arg === "string" ? undefined : arg.token;

                return {
                    url: `/transaksi/kode/${encodeURIComponent(kode)}`,
                    method: "GET",
                    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
                };
            },
        }),
    }),
});

export const {
    useCheckAvailabilityMutation,
    useTransactionMutation,
    useGetTransactionsQuery,
    useGetDetailTransactionQuery,
} = transactionApi;