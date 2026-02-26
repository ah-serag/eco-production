import { apiSlice } from "../../app/api/apiSlice";

export const heroApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({


   addHeroBanner: builder.mutation({
      query: (data) => ({
        url: "/home/admin/addHerobanner",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["HomeSections"],
    }),


    getHeroBanners: builder.query({
      query: () => "/home/admin/hero-banners",
      providesTags: ["HeroBanners"],
    }),

    toggleHeroBannerActive: builder.mutation({
      query: ({ id, is_active }) => ({
        url: `/home/admin/hero-banner/${id}/toggle`,
        method: "PATCH",
        body: { is_active },
      }),
      invalidatesTags: ["HeroBanners"],
    }),

    deleteHeroBanner: builder.mutation({
      query: (id) => ({
        url: `/home/admin/hero-banner/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["HeroBanners"],
    }),
    


  }),


});

export const {
  useAddHeroBannerMutation,
  useGetHeroBannersQuery,
  useToggleHeroBannerActiveMutation,
  useDeleteHeroBannerMutation,
} = heroApiSlice;
