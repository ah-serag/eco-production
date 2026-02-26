import { apiSlice } from "../../app/api/apiSlice";

export const homeApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({



    getHomeSections: builder.query({
      query: ({ type }) => `/home/admin/sections?type=${type}`,
      providesTags: ["HomeSections"],
    }),

    addHomeSection: builder.mutation({
      query: (data) => ({
        url: "/home/admin/AddSections",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["HomeSections"],
    }),



    

    // read + edait 
    getHomeSectionsAdmin : builder.query({
      query: () => "/home/admin/preview",
      providesTags: ["HomeSections"],
    }),

    toggleSectionActive: builder.mutation({
      query: ({ id, is_active }) => ({
        url: `/home/admin/sections/${id}/toggle`,
        method: "PATCH",
        body: { is_active },
      }),
      invalidatesTags: ["HomeSections"],
    }),


    deleteSection: builder.mutation({
      query: (id) => ({
        url: `/home/admin/sections/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["HomeSections"],
     }),

     reorderSections: builder.mutation({
    query: (sections) => ({
    url: "home/admin/sections/reorder",
    method: "PUT",
    body: { sections },
    }),
     invalidatesTags: ["HomeSections"],
   }),




    }),
    






  });


export const {
  useGetHomeSectionsQuery,
  useAddHomeSectionMutation,
  useGetHomeSectionsAdminQuery, 
  useToggleSectionActiveMutation ,
  useDeleteSectionMutation,
  useReorderSectionsMutation
} = homeApiSlice;
