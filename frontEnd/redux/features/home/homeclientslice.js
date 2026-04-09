import { apiSlice } from "../../app/api/apiSlice";

export const homeClientApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    getHomePage: builder.query({
      query: () => "/homeClient/getHomePage",  
    }),

    searchProducts: builder.query({
      query: ({ q, page = 1, limit = 24 }) =>
        `/homeClient/products/search?q=${encodeURIComponent(q)}&page=${page}&limit=${limit}`,
    }),



      searchProductscatAndsub: builder.query({
  query: ({ category, subcategory, page = 1, limit = 30, price_min, price_max, brand, rating }) => {
    const params = new URLSearchParams();

    if (category) params.append("category", category);
    if (subcategory) params.append("subcategory", subcategory);
    if (price_min) params.append("price_min", price_min);
    if (price_max) params.append("price_max", price_max);
    if (brand) params.append("brand", brand); 
    if (rating) params.append("rating", rating);

    params.append("page", page);
    params.append("limit", limit);

    return `/homeClient/searchProductscatAndSub?${params.toString()}`;
  },
     }),


    getProductsByCategory: builder.query({
      query: ({ categoryId,subcategoryId  ,page = 1, limit = 12 }) =>
        `/homeClient/ProductCategory/${categoryId}/${subcategoryId}/?page=${page}&limit=${limit}`,
    }),
    
    getProductsBySubcategory: builder.query({
      query: ({ subcategoryId, page = 1, limit = 12 }) =>
        `/homeClient/ProductSubcategory/${subcategoryId}?page=${page}&limit=${limit}`,
    }),


      getFilterCategory : builder.query({
       query: (categoryId) =>
        `/homeClient/getFilterCategorys?categoryId=${categoryId}`,
    }),

     getCategoryOptionClient: builder.query({
      query: () =>
        `/homeClient/getCategoryOption`,
    }),

     getCagegoryAndSubOptionClient : builder.query({
         query : () => 
          `/homeClient/CategoryAndSubcategoyOption` 
     }),



     getUserInfo  : builder.query({
        query : () =>  `/homeClient/getUserInfo` ,
        providesTags: ["userInfo"]
     }),
  

  }),


});


export const { useGetHomePageQuery ,  useGetUserInfoQuery , useGetFilterCategoryQuery ,useSearchProductscatAndsubQuery
   ,  useGetProductsByCategoryQuery , useGetCagegoryAndSubOptionClientQuery , useGetProductsBySubcategoryQuery ,useGetCategoryOptionClientQuery ,useLazySearchProductsQuery}
    = homeClientApiSlice;
