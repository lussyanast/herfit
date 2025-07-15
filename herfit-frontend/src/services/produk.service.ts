import { apiSlice } from "./base-query";

export const produkApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllProduk: builder.query({
            query: () => ({
                url: "/produk",
                method: "GET",
            }),
        }),
        getDetailProduk: builder.query({
            query: (slug: string) => ({
                url: `/produk/${slug}`,
                method: "GET",
            }),
        }),        
    }),
});

export const { useGetAllProdukQuery, useGetDetailProdukQuery } = produkApi;