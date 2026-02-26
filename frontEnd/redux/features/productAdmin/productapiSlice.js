import { apiSlice } from '../../app/api/apiSlice';

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
  getProductsAdmin: builder.query({
  query: ({ page, limit, sort_by, search, status, category_id }) => {
    const params = new URLSearchParams({
      page: page?.toString() || "1",
      limit: limit?.toString() || "10",
      sort_by: sort_by || "created_at",
      search: search || "",
    });

    if (status) params.append("status", status);
    if (category_id) params.append("category_id", category_id.toString());

    return `/products/getProductsAdmin?${params.toString()}`;
  },
  providesTags: ["Products"],
}),
    getOneProduct: builder.query({
      query: (id) => `/products/getOneProduct/${id}`,
      providesTags: ["Products"],
    }),

  

    toggleActive: builder.mutation({
      query: (id) => ({
        url: `/products/toggleActive/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Products"],
    }),

    editProduct: builder.mutation({
      query: ({ id, data }) => ({
        url: `/products/EditProducts/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Products"],
    }),

    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/deleteProduct/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),

    addProductWithImages: builder.mutation({
      query: (formData) => ({
        url: `/products/addProductWithImages`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Products"],
    }),

    addProductsFromExcel: builder.mutation({
      query: (formData) => ({
        url: `/products/addProductsFromExcel`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Products"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetOneProductQuery,
  useGetProductsAdminQuery,
  useToggleActiveMutation,
  useEditProductMutation,
  useDeleteProductMutation,
  useAddProductWithImagesMutation,
  useAddProductsFromExcelMutation,
} = productsApiSlice;
