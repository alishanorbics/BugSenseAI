import { useFormik } from 'formik';
import * as Yup from 'yup';
import { navigate } from '../../../helpers/navigation';
import { ROUTES } from '../../../helpers/routes';
import { useRequestPasswordResetMutation } from '../../../redux/apis/Auth';

const forgot_password_schema = Yup.object({
  email: Yup.string().trim().email('Enter a valid email address.').required('Email is required.'),
});

const useForgotPasswordController = () => {
  const [requestPasswordReset, { isLoading }] = useRequestPasswordResetMutation();

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: forgot_password_schema,
    onSubmit: async (values) => {
      const result = await requestPasswordReset(values);

      if (result?.data?.success) {
        navigate(ROUTES.VERIFY_RESET_CODE, { email: values.email });
      }
    },
  });

  const goToLogin = () => navigate(ROUTES.LOGIN);

  return {
    values: {
      formik,
      isLoading,
    },
    functions: {
      goToLogin,
    },
  };
};

export default useForgotPasswordController;
