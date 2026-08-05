import { baseApi } from '../Base';

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    changePassword: builder.mutation({
      query: (payload) => ({
        url: '/auth/change-password',
        method: 'POST',
        body: payload,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useChangePasswordMutation } = userApi;
