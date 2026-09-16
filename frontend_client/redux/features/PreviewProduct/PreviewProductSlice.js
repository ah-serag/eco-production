import { apiSlice } from "../../app/api/apiSlice";

export const PreviewProduct = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSingleProduct: builder.query({
      query: (slug) => ({
        url: `/product/${slug}`, 
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetSingleProductQuery,
} = PreviewProduct;