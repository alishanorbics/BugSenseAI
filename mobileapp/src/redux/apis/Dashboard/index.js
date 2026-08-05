import { baseApi } from '../Base';

const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardMetrics: builder.query({
      query: () => ({
        url: '/dashboard/metrics',
        method: 'GET',
      }),
      providesTags: ['Project', 'Bug'],
    }),
  }),
  overrideExisting: false,
});

export const { useGetDashboardMetricsQuery } = dashboardApi;
