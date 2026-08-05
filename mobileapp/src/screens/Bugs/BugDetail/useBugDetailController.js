import { useRoute } from '@react-navigation/native';
import { useGetBugQuery } from '../../../redux/apis/Bug';

const useBugDetailController = () => {
  const route = useRoute();
  const { project_id, bug_id } = route.params || {};

  const { data: result, isLoading } = useGetBugQuery(
    { project_id, id: bug_id },
    { skip: !project_id || !bug_id },
  );
  const bug = result?.data;

  return {
    values: {
      bug,
      isLoading,
    },
    functions: {},
  };
};

export default useBugDetailController;
