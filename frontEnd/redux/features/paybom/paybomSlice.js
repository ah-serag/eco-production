import { apiSlice } from "../../app/api/apiSlice";

export const checkoutApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    checkout: builder.mutation({
      query: ({ items ,billingData}) => ({
        url: `/api/payment/checkout`,
        method: "POST",
        body: {
              items ,
              billingData
              },
      }),
    }),

  }),
});

export const {
  useCheckoutMutation,
} = checkoutApiSlice;