import { apiSlice } from "../../app/api/apiSlice";

export const homeProductsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    addHomeProduct: builder.mutation({
      query: (data) => ({
        url: "/homeProducts/admin/home-products",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["HomeProducts"],
    }),

    // getHomeProducts: builder.query({
    //   query: () => "/homeProducts/admin/home-products",
    //   providesTags: ["HomeProducts"],
    // }),


    // toggleHomeProductActive: builder.mutation({
    //   query: ({ id, is_active }) => ({
    //     url: `/homeProducts/admin/home-product/${id}/toggle`,
    //     method: "PATCH",
    //     body: { is_active },
    //   }),
    //   invalidatesTags: ["HomeProducts"],
    // }),


    // deleteHomeProduct: builder.mutation({
    //   query: (id) => ({
    //     url: `/homeProducts/admin/home-product/${id}`,
    //     method: "DELETE",
    //   }),
    //   invalidatesTags: ["HomeProducts"],
    // }),

  }),
});

export const {
  useAddHomeProductMutation,
  useGetHomeProductsQuery,
  useToggleHomeProductActiveMutation,
  useDeleteHomeProductMutation,
} = homeProductsApiSlice;
