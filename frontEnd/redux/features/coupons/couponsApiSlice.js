import { apiSlice } from '../../app/api/apiSlice';

export const couponsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    getCoupons: builder.query({
      query: () => `/admin/coupons`,
      providesTags: ["Coupons"],
    }),

    addCoupon: builder.mutation({
      query: (data) => ({
        url: `/admin/coupons`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Coupons"],
    }),

    deleteCoupon: builder.mutation({
      query: (id) => ({
        url: `/admin/coupons/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Coupons"],
    }),

    toggleCouponStatus: builder.mutation({
      query: ({ id, is_active }) => ({
        url: `/admin/coupons/${id}`,
        method: "PATCH",
        body: { is_active },
      }),
      invalidatesTags: ["Coupons"],
    }),
     
   checkCoupons: builder.mutation({
      query: (data) => ({
        url: '/api/payment/check-Coupons', 
        method: 'POST',
        body: data, 
      }),
    }),
  }),
});

export const {
  useGetCouponsQuery,
  useAddCouponMutation,
  useDeleteCouponMutation,
  useToggleCouponStatusMutation,
  useCheckCouponsMutation
} = couponsApiSlice;
