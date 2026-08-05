import { useFormik } from 'formik';
import { useRoute } from '@react-navigation/native';
import * as Yup from 'yup';
import { navigate } from '../../../helpers/navigation';
import { ROUTES } from '../../../helpers/routes';
import { useVerifyResetCodeMutation } from '../../../redux/apis/Auth';

const verify_reset_code_schema = Yup.object({
  code: Yup.string()
    .trim()
    .length(6, 'Code must be 6 digits.')
    .matches(/^\d+$/, 'Code must contain only digits.')
    .required('Code is required.'),
});

const useVerifyResetCodeController = () => {
  const route = useRoute();
  const { email } = route.params || {};
  const [verifyResetCode, { isLoading }] = useVerifyResetCodeMutation();

  const formik = useFormik({
    initialValues: {
      code: '',
    },
    validationSchema: verify_reset_code_schema,
    onSubmit: async (values) => {
      const result = await verifyResetCode({ email, code: values.code });

      if (result?.data?.success) {
        navigate(ROUTES.RESET_PASSWORD, { email, code: values.code });
      }
    },
  });

  const goToLogin = () => navigate(ROUTES.LOGIN);

  return {
    values: {
      formik,
      isLoading,
      email,
    },
    functions: {
      goToLogin,
    },
  };
};

export default useVerifyResetCodeController;
