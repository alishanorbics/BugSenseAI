import { useSelector } from 'react-redux';
import { ROLES } from '../../../helpers/data';
import { navigate } from '../../../helpers/navigation';
import { ROUTES } from '../../../helpers/routes';
import { useListProjectsQuery } from '../../../redux/apis/Project';
import { selectUser } from '../../../redux/selectors';

const GROUP_ORDER = ['needs_attention', 'active', 'all_clear'];

const GROUP_LABELS = {
  needs_attention: 'Needs Attention',
  active: 'Active',
  all_clear: 'All Clear',
};

// A project's "status" isn't a stored field — it's derived from its bug
// breakdown: any open (unassigned/reopened) bug means it needs attention,
// any bug still moving through the pipeline makes it active, otherwise
// everything is closed (or there are no bugs yet) and it's all clear.
const getProjectGroup = (project) => {
  const stats = project.bug_stats || { open: 0, in_progress: 0, closed: 0, total: 0 };

  if (stats.open > 0) {
    return 'needs_attention';
  }

  if (stats.in_progress > 0) {
    return 'active';
  }

  return 'all_clear';
};

const buildSectionedData = (projects) => {
  const groups = { needs_attention: [], active: [], all_clear: [] };

  projects.forEach((project) => {
    groups[getProjectGroup(project)].push(project);
  });

  const sectioned_data = [];

  GROUP_ORDER.forEach((group_key) => {
    if (groups[group_key].length > 0) {
      sectioned_data.push({ type: 'header', key: `header-${group_key}`, title: GROUP_LABELS[group_key] });

      groups[group_key].forEach((project) => {
        sectioned_data.push({ type: 'project', key: project._id, project });
      });
    }
  });

  return sectioned_data;
};

const useProjectListController = () => {
  const user = useSelector(selectUser);
  const { data: result, isLoading } = useListProjectsQuery();

  const projects = result?.data || [];
  const is_qa = user?.role === ROLES.QA_ENGINEER;
  const sectioned_data = buildSectionedData(projects);

  const goToProjectDetail = (project_id) => navigate(ROUTES.PROJECT_DETAIL, { project_id });
  const goToCreateProject = () => navigate(ROUTES.CREATE_PROJECT);

  return {
    values: {
      sectioned_data,
      isLoading,
      is_qa,
    },
    functions: {
      goToProjectDetail,
      goToCreateProject,
    },
  };
};

export default useProjectListController;
