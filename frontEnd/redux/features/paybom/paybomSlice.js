import { apiSlice } from "../../app/api/apiSlice";

export const checkoutApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    checkout: builder.mutation({
      query: ({ items, billingData }) => ({
        url: `/api/payment/checkout`,
        method: "POST",
        body: {
          items,
          billingData,
        },
        invalidatesTags: ['ClientOrders'],
      }),
    }),

    checkoutWallet: builder.mutation({
      query: ({ items, billingData, walletNumber }) => ({
        url: `/api/payment/checkoutWallet`, 
        method: "POST",
        body: {
          items,
          billingData,
          walletNumber, 
        },
        invalidatesTags: ['ClientOrders'],
      }),
    }),

    checkoutCash: builder.mutation({
      query: ({ items, billingData }) => ({
        url: `/api/payment/checkoutCash`, 
        method: "POST",
        body: {
          items,
          billingData,
        },
        invalidatesTags: ['ClientOrders'],
      }),
    }),
  }),
});

export const {
  useCheckoutMutation,
  useCheckoutWalletMutation,
  useCheckoutCashMutation, 
} = checkoutApiSlice;