import { useSelector } from 'react-redux';
import { ROLES } from '../../helpers/data';
import { navigate } from '../../helpers/navigation';
import { ROUTES } from '../../helpers/routes';
import { useGetDashboardMetricsQuery } from '../../redux/apis/Dashboard';
import { selectUser } from '../../redux/selectors';

const useDashboardController = () => {
  const user = useSelector(selectUser);
  const is_qa = user?.role === ROLES.QA_ENGINEER;
  const role_label = is_qa ? 'QA Engineer' : 'Developer';
  const role_metric_label = is_qa ? 'Unassigned Bugs' : 'Assigned to You';

  const { data: result, isLoading } = useGetDashboardMetricsQuery();
  const metrics = result?.data;

  const goToProjects = () => navigate(ROUTES.PROJECT_LIST);

  return {
    values: {
      user,
      role_label,
      role_metric_label,
      metrics,
      isLoading,
    },
    functions: {
      goToProjects,
    },
  };
};

export default useDashboardController;
