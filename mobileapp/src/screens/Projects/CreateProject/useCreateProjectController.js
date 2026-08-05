import { useFormik } from 'formik';
import * as Yup from 'yup';
import { goBack } from '../../../helpers/navigation';
import { useCreateProjectMutation } from '../../../redux/apis/Project';

const create_project_schema = Yup.object({
  name: Yup.string()
    .trim()
    .min(2, 'Project name must be at least 2 characters.')
    .required('Project name is required.'),
  description: Yup.string().trim(),
});

const useCreateProjectController = () => {
  const [createProject, { isLoading }] = useCreateProjectMutation();

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
    },
    validationSchema: create_project_schema,
    onSubmit: async (values) => {
      const result = await createProject(values);

      if (result?.data?.success) {
        goBack();
      }
    },
  });

  return {
    values: {
      formik,
      isLoading,
    },
    functions: {
      cancel: goBack,
    },
  };
};

export default useCreateProjectController;
