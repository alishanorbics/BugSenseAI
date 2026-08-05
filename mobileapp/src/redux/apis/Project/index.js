import { baseApi } from '../Base';

const projectApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listProjects: builder.query({
      query: (params) => ({
        url: '/projects',
        method: 'GET',
        params,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((project) => ({ type: 'Project', id: project._id })),
              { type: 'Project', id: 'LIST' },
            ]
          : [{ type: 'Project', id: 'LIST' }],
    }),
    getProject: builder.query({
      query: (id) => ({
        url: `/projects/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Project', id }],
    }),
    createProject: builder.mutation({
      query: (payload) => ({
        url: '/projects',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [{ type: 'Project', id: 'LIST' }],
    }),
    updateProject: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `/projects/${id}`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Project', id },
        { type: 'Project', id: 'LIST' },
      ],
    }),
    listMembers: builder.query({
      query: (project_id) => ({
        url: `/projects/${project_id}/members`,
        method: 'GET',
      }),
      providesTags: (result, error, project_id) => [{ type: 'Project', id: project_id }],
    }),
    addMember: builder.mutation({
      query: ({ project_id, ...payload }) => ({
        url: `/projects/${project_id}/members`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: (result, error, { project_id }) => [{ type: 'Project', id: project_id }],
    }),
    removeMember: builder.mutation({
      query: ({ project_id, member_id }) => ({
        url: `/projects/${project_id}/members/${member_id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { project_id }) => [{ type: 'Project', id: project_id }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useListProjectsQuery,
  useGetProjectQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useListMembersQuery,
  useAddMemberMutation,
  useRemoveMemberMutation,
} = projectApi;
