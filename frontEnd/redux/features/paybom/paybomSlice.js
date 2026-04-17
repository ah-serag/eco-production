import { apiSlice } from "../../app/api/apiSlice";

export const checkoutApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    checkout: builder.mutation({
      query: ({ items, billingData , couponCode }) => ({
        url: `/api/payment/checkout`,
        method: "POST",
        body: {
          items,
          billingData,
          couponCode
        },
        invalidatesTags: ['ClientOrders'],
      }),
    }),

    checkoutWallet: builder.mutation({
      query: ({ items, billingData, walletNumber ,couponCode}) => ({
        url: `/api/payment/checkoutWallet`, 
        method: "POST",
        body: {
          items,
          billingData,
          walletNumber, 
          couponCode
        },
        invalidatesTags: ['ClientOrders'],
      }),
    }),

    checkoutCash: builder.mutation({
      query: ({ items, billingData , couponCode}) => ({
        url: `/api/payment/checkoutCash`, 
        method: "POST",
        body: {
          items,
          billingData,
          couponCode
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