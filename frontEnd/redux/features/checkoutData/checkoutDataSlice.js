import { apiSlice } from "../../app/api/apiSlice";

export const billingApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBillingData: builder.query({
      query: () => ({
        url: `/api/checkoutdData/user-billingdata`,
        method: "GET",
      }),
      providesTags: ['BillingData'],
    }),
  }),
});

export const { useGetBillingDataQuery } = billingApiSlice;