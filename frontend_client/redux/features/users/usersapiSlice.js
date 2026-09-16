import { apiSlice } from '../../app/api/apiSlice';

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: ({ offset, limit, search, role, status }) =>
        `/users?offset=${offset}&limit=${limit}&search=${search || ''}&role=${role || ''}&status=${status || ''}`,
      providesTags: ['Users'],
    }),
    updateUserRole: builder.mutation({
      query: ({ id, role }) => ({
        url: `/users/${id}/role`,
        method: 'PATCH',
        body: { role },
      }),
      invalidatesTags: ['Users'],
    }),
    toggleUserActive: builder.mutation({
      query: ({ id, is_active }) => ({
        url: `/users/${id}/active`,
        method: 'PATCH',
        body: { is_active },
      }),
      invalidatesTags: ['Users'],
    }),
    deleteUser: builder.mutation({
      query: (id) => {
 
        return {
          url: `/users/${id}`,
          method: 'DELETE',
        };
      },
      invalidatesTags: ['Users'],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useUpdateUserRoleMutation,
  useToggleUserActiveMutation,
  useDeleteUserMutation, 
} = usersApiSlice;
