import { apiSlice } from "./base-query";

export const listingApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllListing: builder.query({
            query: () => ({
                url: "/listing",
                method: "GET",
            }),
        }),
    }),
});

export const { useGetAllListingQuery } = listingApi;