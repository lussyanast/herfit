import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL!;
export const backendBaseUrl =
  process.env.NEXT_PUBLIC_BACKEND_BASE_URL || apiBaseUrl.replace(/\/api\/?$/, "");

export const baseQuery = fetchBaseQuery({
  baseUrl: apiBaseUrl,
  credentials: "include",
  prepareHeaders: (headers) => {
    headers.set("Accept", "application/json");
    headers.set("X-Requested-With", "XMLHttpRequest");
    return headers;
  },
});