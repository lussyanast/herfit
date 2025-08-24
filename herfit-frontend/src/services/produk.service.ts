import { apiSlice } from "./apiSlice";

export const produkApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllProduk: builder.query<any, void>({
            query: () => ({ url: "/produk", method: "GET" }),
        }),
        getDetailProduk: builder.query<any, string>({
            query: (slug) => ({ url: `/produk/${slug}`, method: "GET" }),
        }),
    }),
});

export const { useGetAllProdukQuery, useGetDetailProdukQuery } = produkApi;