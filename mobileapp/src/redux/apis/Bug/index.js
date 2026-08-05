import { baseApi } from '../Base';

const bugApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listBugs: builder.query({
      query: ({ project_id, ...params }) => ({
        url: `/projects/${project_id}/bugs`,
        method: 'GET',
        params,
      }),
      providesTags: (result, error, { project_id }) =>
        result?.data
          ? [
              ...result.data.map((bug) => ({ type: 'Bug', id: bug._id })),
              { type: 'Bug', id: `LIST-${project_id}` },
            ]
          : [{ type: 'Bug', id: `LIST-${project_id}` }],
    }),
    getBug: builder.query({
      query: ({ project_id, id }) => ({
        url: `/projects/${project_id}/bugs/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, { id }) => [{ type: 'Bug', id }],
    }),
    createBug: builder.mutation({
      query: ({ project_id, formData }) => ({
        url: `/projects/${project_id}/bugs`,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: (result, error, { project_id }) => [{ type: 'Bug', id: `LIST-${project_id}` }],
    }),
  }),
  overrideExisting: false,
});

export const { useListBugsQuery, useGetBugQuery, useCreateBugMutation } = bugApi;
