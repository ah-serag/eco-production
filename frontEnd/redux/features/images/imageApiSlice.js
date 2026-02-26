import { apiSlice } from "../../app/api/apiSlice";

export const imagesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    
     uploadImages: builder.mutation({
      query: (formData) => ({
        url: `/upload/Images`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Images"],
    }),

    getImages: builder.query({
      query: ({ page, limit, sort, search }) =>
        `/upload/getImages?page=${page}&limit=${limit}&sort=${sort || ''}&search=${search || ''}`,
      providesTags: ["Images"],
    }),

    deleteImage: builder.mutation({
      query: (id) => ({
        url: `/upload/del_image/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Images"],
    }),

  }),
});

export const {
  useGetImagesQuery,
  useDeleteImageMutation,
  useUploadImagesMutation,
} = imagesApiSlice;
