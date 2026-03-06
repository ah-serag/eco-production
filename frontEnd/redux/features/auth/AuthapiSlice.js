import { apiSlice } from '../../app/api/apiSlice';

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (credentials) => ({
        url: '/auth/register',
        method: 'POST',
        body: { ...credentials },
      }),
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/sign_in',
        method: 'POST',
        body: { ...credentials },
       invalidatesTags:["userInfo"]

      }),
    }),

    Logout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
        
      }),
      invalidatesTags:["userInfo"]
    }),
  }),
});
export const { useRegisterMutation, useLoginMutation, useLogoutMutation } = authApiSlice;