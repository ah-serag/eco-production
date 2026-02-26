import { apiSlice } from "../../app/api/apiSlice";

export const limitedOfferBannerApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({


    addLimitedOfferBanner: builder.mutation({
      query: (data) => ({
        url: "/home/admin/add-limited-offer-banner",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["LimitedOfferBanners"],
    }),

    getLimitedOfferBanners: builder.query({
      query: () => "/home/admin/limited-offer-banners",
      providesTags: ["LimitedOfferBanners"],
    }),

    toggleLimitedOfferBannerActive: builder.mutation({
      query: ({ id, is_active }) => ({
        url: `/home/admin/limited-offer-banner/${id}/toggle`,
        method: "PATCH",
        body: { is_active },
      }),
      invalidatesTags: ["LimitedOfferBanners"],
    }),

    deleteLimitedOfferBanner: builder.mutation({
      query: (id) => ({
        url: `/home/admin/limited-offer-banner/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["LimitedOfferBanners"],
    }),

    // ================= FRONT =================

    getActiveLimitedOfferBanner: builder.query({
      query: (section_id) => `/home/limited-offer-banner/${section_id}`,
      providesTags: ["LimitedOfferBanners"],
    }),

  }),
});

export const {
  useAddLimitedOfferBannerMutation,
  useGetLimitedOfferBannersQuery,
  useToggleLimitedOfferBannerActiveMutation,
  useDeleteLimitedOfferBannerMutation,
  useGetActiveLimitedOfferBannerQuery,
} = limitedOfferBannerApiSlice;
