import { apiSlice } from "../../app/api/apiSlice";

export const subcategoryBannerApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    addSubcategoryBanner: builder.mutation({
      query: (data) => ({
        url: "/home/admin/subcategory-banner",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["HomeSections", "SubcategoryBanners"],
    }),

    getSubcategoryBanners: builder.query({
      query: () => "/home/admin/subcategory-banners",
      providesTags: ["SubcategoryBanners"],
    }),

    toggleSubcategoryBannerActive: builder.mutation({
      query: ({ id, is_active }) => ({
        url: `/home/admin/subcategory-banners/${id}/toggle`,
        method: "PATCH",
        body: { is_active },
      }),
      invalidatesTags: ["SubcategoryBanners"],
    }),

    deleteSubcategoryBanner: builder.mutation({
      query: (id) => ({
        url: `/home/admin/subcategory-banners/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SubcategoryBanners"],
    }),

  }),
});

export const {
  useAddSubcategoryBannerMutation,
  useGetSubcategoryBannersQuery,
  useToggleSubcategoryBannerActiveMutation,
  useDeleteSubcategoryBannerMutation,
} = subcategoryBannerApiSlice;
