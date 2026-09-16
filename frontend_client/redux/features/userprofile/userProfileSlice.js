import { apiSlice } from "../../app/api/apiSlice";

export const userProfileApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    getProfile: builder.query({
      query: () => ({
        url: "/api/profile",
        method: "GET",
      }),
      providesTags: ["Profile"],
    }),

    updateAccount: builder.mutation({
      query: (body) => ({
        url: "/api/profile/account",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Profile" , "userInfo"],
    }),

    updateBilling: builder.mutation({
      query: (body) => ({
        url: "/api/profile/billing",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Profile", "BillingData"],
    }),

  }),
});

export const {
  useGetProfileQuery,
  useUpdateAccountMutation,
  useUpdateBillingMutation,
} = userProfileApiSlice;
