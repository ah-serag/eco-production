import { apiSlice } from "../../app/api/apiSlice";

export const videosApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    
    uploadVideos: builder.mutation({
      query: (formData) => ({
        url: `/admin/videos/upload`, 
        method: "POST",
        body: formData,
       
      }),
      invalidatesTags: ["Videos"],
    }),

    getVideos: builder.query({
      query: ({ page = 1, limit = 10, sort = '', search = '' }) =>
        `/admin/videos/getVideos?page=${page}&limit=${limit}&sort=${sort}&search=${search}`,
      providesTags: ["Videos"],
    }),

    deleteVideo: builder.mutation({
      query: (id) => ({
        url: `/admin/videos/del_video/${id}`, 
        method: "DELETE",
      }),
      invalidatesTags: ["Videos"],
    }),

    // setMainVideo: builder.mutation({
    //   query: ({ videoId, productId }) => ({
    //     url: `/videos/set-main`,
    //     method: "PATCH",
    //     body: { videoId, productId },
    //   }),
    //   invalidatesTags: ["Videos", "Products"],
    // }),

  }),
});

export const {
  useGetVideosQuery,
  useDeleteVideoMutation,
  useUploadVideosMutation,
  // useSetMainVideoMutation,
} = videosApiSlice;