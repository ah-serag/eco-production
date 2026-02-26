import { apiSlice } from '../../app/api/apiSlice';

export const productsApiSlice = apiSlice.injectEndpoints({

  endpoints: (builder) => ({

   
  getProductsAndVendorsAdmin: builder.query({
  query: ({ page, limit, search, status}) => {
    const params = new URLSearchParams({
      page: page?.toString() || "1",
      limit: limit?.toString() || "10",
      search: search || "",
    });

    if (status) params.append("status", status);

    return `/vendors/getProductsAndVendorsAdmin?${params.toString()}`;
  },
  providesTags: ["Products"],
}),






  getProductsVendor: builder.query({
  query: ({ page, limit, sort_by, search, status, category_id }) => {
    const params = new URLSearchParams({
      page: page?.toString() || "1",
      limit: limit?.toString() || "10",
      sort_by: sort_by || "created_at",
      search: search || "",
    });

    if (status) params.append("status", status);
    if (category_id) params.append("category_id", category_id.toString());

    return `/vendors/getProductsVendor?${params.toString()}`;
  },
  providesTags: ["Products"],
  }),
  })


});

export const {

useGetProductsVendorQuery,
useGetProductsAndVendorsAdminQuery,
} = productsApiSlice;
