import { apiSlice } from "./apiSlice";
import { backendBaseUrl } from "./apiSlice";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCsrf: builder.query<{ status?: string }, void>({
      query: () => ({
        url: `${backendBaseUrl}/sanctum/csrf-cookie`,
        method: "GET",
      }),
    }),

    login: builder.mutation<any, { email: string; password: string }>({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Me"],
    }),

    register: builder.mutation<
      any,
      { name: string; email: string; password: string }
    >({
      query: (payload) => ({
        url: "/register",
        method: "POST",
        body: payload,
      }),
    }),

    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          // bersihkan cache supaya data user lama tidak nempel
          dispatch(apiSlice.util.resetApiState());
        }
      },
    }),

    me: builder.query<{ success: boolean; data: any }, void>({
      query: () => ({ url: "/user", method: "GET" }),
      providesTags: ["Me"],
    }),
  }),
});

export const {
  useLazyGetCsrfQuery,
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useMeQuery,
} = authApi;