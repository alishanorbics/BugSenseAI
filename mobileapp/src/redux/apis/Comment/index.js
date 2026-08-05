import { baseApi } from '../Base';

const commentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listComments: builder.query({
      query: ({ project_id, bug_id, ...params }) => ({
        url: `/projects/${project_id}/bugs/${bug_id}/comments`,
        method: 'GET',
        params,
      }),
      providesTags: (result, error, { bug_id }) =>
        result?.data
          ? [
              ...result.data.map((comment) => ({ type: 'Comment', id: comment._id })),
              { type: 'Comment', id: `LIST-${bug_id}` },
            ]
          : [{ type: 'Comment', id: `LIST-${bug_id}` }],
    }),
    createComment: builder.mutation({
      query: ({ project_id, bug_id, text }) => ({
        url: `/projects/${project_id}/bugs/${bug_id}/comments`,
        method: 'POST',
        body: { text },
      }),
      invalidatesTags: (result, error, { bug_id }) => [{ type: 'Comment', id: `LIST-${bug_id}` }],
    }),
  }),
  overrideExisting: false,
});

export const { useListCommentsQuery, useCreateCommentMutation } = commentApi;
