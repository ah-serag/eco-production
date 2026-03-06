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

    getClientOrders: builder.query({
      query: ({ offset = 0, limit = 10, status } = {}) => {
        let params = new URLSearchParams({
          offset: offset.toString(),
          limit: limit.toString(),
        });

        if (status) params.append('status', status);
        return `/clientOrders/getClientOrders?${params.toString()}`;
      },
      providesTags: ['ClientOrders'],
    }),

    updateOrderStatus: builder.mutation({
      query: ({ order_id, status }) => ({
        url: `/admin/orders/update-status/${order_id}`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Orders', 'ClientOrders', 'OrderItems'],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetAllOrderItemsQuery,
  useGetClientOrdersQuery,
  useUpdateOrderStatusMutation,
} = ordersApiSlice;


