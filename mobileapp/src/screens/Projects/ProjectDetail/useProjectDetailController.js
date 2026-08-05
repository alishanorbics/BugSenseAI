import { useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { ROLES } from '../../../helpers/data';
import { navigate } from '../../../helpers/navigation';
import { ROUTES } from '../../../helpers/routes';
import { useListBugsQuery } from '../../../redux/apis/Bug';
import { useGetProjectQuery } from '../../../redux/apis/Project';
import { selectUser } from '../../../redux/selectors';

const useProjectDetailController = () => {
  const route = useRoute();
  const { project_id } = route.params || {};
  const user = useSelector(selectUser);

  const { data: project_result, isLoading: is_project_loading } = useGetProjectQuery(project_id, {
    skip: !project_id,
  });
  const { data: bugs_result, isLoading: is_bugs_loading } = useListBugsQuery(
    { project_id },
    { skip: !project_id },
  );

  const project = project_result?.data;
  const bugs = bugs_result?.data || [];
  const is_qa = user?.role === ROLES.QA_ENGINEER;
  const is_creator = is_qa && project?.created_by?._id === user?.id;

  const goToAddMember = () => navigate(ROUTES.ADD_MEMBER, { project_id });
  const goToCreateBug = () => navigate(ROUTES.CREATE_BUG, { project_id });
  const goToBugDetail = (bug_id) => navigate(ROUTES.BUG_DETAIL, { project_id, bug_id });

  return {
    values: {
      project,
      isLoading: is_project_loading,
      bugs,
      isBugsLoading: is_bugs_loading,
      can_manage_members: is_creator,
      can_report_bug: is_creator,
    },
    functions: {
      goToAddMember,
      goToCreateBug,
      goToBugDetail,
    },
  };
};

export default useProjectDetailController;
