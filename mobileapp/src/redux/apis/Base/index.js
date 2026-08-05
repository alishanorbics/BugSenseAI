import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import env from '../../../config/env';
import { selectToken } from '../../selectors';

export const TAG_TYPES = ['User', 'Project', 'Bug', 'Comment'];

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: fetchBaseQuery({
    baseUrl: env.API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = selectToken(getState());

      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: TAG_TYPES,
  endpoints: () => ({}),
});
