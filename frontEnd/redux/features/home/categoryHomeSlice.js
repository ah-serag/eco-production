import { apiSlice } from "../../app/api/apiSlice";

export const homeCategoriesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    addHomeCategory: builder.mutation({
      query: (data) => ({
        url: "/homeCategory/admin/addHomeCategory",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["HomeCategories"],
    }),
    

    getCategoryHome: builder.query({
      query: () => "/homeCategory/admin/getCategoryHomeAdmin",
      providesTags: ["HomeCategories"],
    }),

    


    toggleHomeCategoryActive: builder.mutation({
      query: (id) => ({
        url: `/homeCategory/admin/${id}/toggle`,
        method: "PATCH",
      }),
      invalidatesTags: ["HomeCategories"],
    }),

    deleteHomeCategory: builder.mutation({
      query: (id) => ({
        url: `/homeCategory/admin/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["HomeCategories"],
    }),

  }),
});

export const {
  useGetCategoryHomeQuery,
  useAddHomeCategoryMutation,
  useToggleHomeCategoryActiveMutation,
  useDeleteHomeCategoryMutation,
} = homeCategoriesApiSlice;
