import { apiSlice } from '../../app/api/apiSlice';

export const ordersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: ({ offset = 0, limit = 10, id, status, is_paid }) => {
        let params = new URLSearchParams({
          offset: offset.toString(),
          limit: limit.toString(),
        });

        if (id) params.append('id', id);
        if (status) params.append('status', status);
        if (is_paid !== undefined) params.append('is_paid', is_paid.toString());

        return `/admin/orders?${params.toString()}`;
      },
      providesTags: ['Orders'],
    }),

    getOrderItems: builder.query({
      query: (orderId) => `/admin/orders/${orderId}/items`,
      providesTags: (result, error, orderId) => [{ type: 'Orders', id: orderId }],
    }),

    getAllOrderItems: builder.query({
      query: ({ offset = 0, limit = 10, order_id, product_id }) => {
        let params = new URLSearchParams({
          offset: offset.toString(),
          limit: limit.toString(),
        });

        if (order_id) params.append('order_id', order_id);
        if (product_id) params.append('product_id', product_id);

        return `/admin/orders-items?${params.toString()}`;
      },
      providesTags: ['OrderItems'],
    }),

    updateOrderStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/admin/orders/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Orders'],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderItemsQuery,
  useUpdateOrderStatusMutation,
  useGetAllOrderItemsQuery
} = ordersApiSlice;