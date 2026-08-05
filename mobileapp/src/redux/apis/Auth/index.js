import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import env from '../../../config/env';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: env.API_BASE_URL,
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation({
      query: (payload) => ({
        url: '/auth/register',
        method: 'POST',
        body: payload,
      }),
    }),
    requestPasswordReset: builder.mutation({
      query: (payload) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body: payload,
      }),
    }),
    verifyResetCode: builder.mutation({
      query: (payload) => ({
        url: '/auth/verify-reset-code',
        method: 'POST',
        body: payload,
      }),
    }),
    resetPassword: builder.mutation({
      query: (payload) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body: payload,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useRequestPasswordResetMutation,
  useVerifyResetCodeMutation,
  useResetPasswordMutation,
} = authApi;
