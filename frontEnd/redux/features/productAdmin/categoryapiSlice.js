import { apiSlice } from '../../app/api/apiSlice';

export const categoriesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({



      


    getCategory: builder.query({
      query: () => `/products/getCategory`,
      providesTags: ["Categories"],
    }),

    getCategoryOptions: builder.query({
      query: () => `/products/getCategoryOptions`,
      providesTags: ["Categories"],
    }),
   
    getSubcategoryOptions: builder.query({
      query: () => `/products/getSubcategoryOptions`,
      providesTags: ["Categories"],
    }),
   
    addCategories: builder.mutation({
      query: (data) => ({
        url: `/products/addcategories`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Categories"],
    }),

    addSubcategories: builder.mutation({
      query: (data) => ({
        url: `/products/addsubcategories`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Categories"],
    }),

     
    getCategoryAndSubAdmin : builder.query({
      query : ()=> `/products/getCategoryAndSubAdmin` ,
      providesTags: ["Categories"],

    }) ,

    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/products/deleteCategory/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Categories"],
    }) ,

    deleteSubcategory: builder.mutation({
      query: (id) => ({
        url: `/products/deleteSubcategory/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Categories"],
    }) 



  }),
});

export const {
  useGetCategoryQuery,
  useAddCategoriesMutation,
  useAddSubcategoriesMutation,
  useGetCategoryOptionsQuery,
  useGetSubcategoryOptionsQuery ,
  useGetCategoryAndSubAdminQuery,
  useDeleteCategoryMutation,
  useDeleteSubcategoryMutation,
} = categoriesApiSlice;
