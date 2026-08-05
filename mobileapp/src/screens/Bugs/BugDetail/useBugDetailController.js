import { useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { BUG_STATUS, ROLES } from '../../../helpers/data';
import {
  useAssignBugMutation,
  useCloseBugMutation,
  useGetBugQuery,
  useReopenBugMutation,
  useUpdateBugStatusMutation,
  useVerifyBugMutation,
} from '../../../redux/apis/Bug';
import { useCreateCommentMutation, useListCommentsQuery } from '../../../redux/apis/Comment';
import { useListMembersQuery } from '../../../redux/apis/Project';
import { selectUser } from '../../../redux/selectors';

const useBugDetailController = () => {
  const route = useRoute();
  const { project_id, bug_id } = route.params || {};
  const user = useSelector(selectUser);
  const [selected_developer_id, setSelectedDeveloperId] = useState(null);
  const [comment_text, setCommentText] = useState('');

  const { data: result, isLoading } = useGetBugQuery(
    { project_id, id: bug_id },
    { skip: !project_id || !bug_id },
  );
  const bug = result?.data;

  const is_qa = user?.role === ROLES.QA_ENGINEER;
  const is_developer = user?.role === ROLES.DEVELOPER;
  const is_creator = is_qa && bug?.project?.created_by === user?.id;
  const is_assignee = is_developer && bug?.assignee?._id === user?.id;
  const can_assign = is_creator && bug?.status === BUG_STATUS.CREATED;
  const can_verify_or_reopen = is_creator && bug?.status === BUG_STATUS.FIXED;
  const can_close = is_creator && bug?.status === BUG_STATUS.VERIFIED;

  const { data: members_result } = useListMembersQuery(project_id, { skip: !can_assign });
  const developers = (members_result?.data || []).filter((member) => member.role === ROLES.DEVELOPER);

  const [assignBug, { isLoading: is_assigning }] = useAssignBugMutation();
  const [updateBugStatus, { isLoading: is_updating_status }] = useUpdateBugStatusMutation();

  const confirmAssignment = async () => {
    if (!selected_developer_id) {
      return;
    }

    const response = await assignBug({ project_id, id: bug_id, developer_id: selected_developer_id });

    if (response?.data?.success) {
      setSelectedDeveloperId(null);
    }
  };

  const startProgress = () => updateBugStatus({ project_id, id: bug_id, status: BUG_STATUS.IN_PROGRESS });
  const markFixed = () => updateBugStatus({ project_id, id: bug_id, status: BUG_STATUS.FIXED });

  const [verifyBug, { isLoading: is_verifying }] = useVerifyBugMutation();
  const [closeBug, { isLoading: is_closing }] = useCloseBugMutation();
  const [reopenBug, { isLoading: is_reopening }] = useReopenBugMutation();

  const verifyFix = () => verifyBug({ project_id, id: bug_id });
  const closeThisBug = () => closeBug({ project_id, id: bug_id });
  const rejectAndReopen = () => reopenBug({ project_id, id: bug_id });

  const { data: comments_result, isLoading: is_comments_loading } = useListCommentsQuery(
    { project_id, bug_id },
    { skip: !project_id || !bug_id },
  );
  const comments = comments_result?.data || [];

  const [createComment, { isLoading: is_commenting }] = useCreateCommentMutation();

  const submitComment = async () => {
    if (!comment_text.trim()) {
      return;
    }

    const response = await createComment({ project_id, bug_id, text: comment_text.trim() });

    if (response?.data?.success) {
      setCommentText('');
    }
  };

  return {
    values: {
      bug,
      isLoading,
      can_assign,
      developers,
      selected_developer_id,
      is_assigning,
      is_assignee,
      is_updating_status,
      can_verify_or_reopen,
      can_close,
      is_verifying,
      is_closing,
      is_reopening,
      comments,
      is_comments_loading,
      comment_text,
      is_commenting,
    },
    functions: {
      setSelectedDeveloperId,
      confirmAssignment,
      startProgress,
      markFixed,
      verifyFix,
      closeThisBug,
      rejectAndReopen,
      setCommentText,
      submitComment,
    },
  };
};

export default useBugDetailController;
