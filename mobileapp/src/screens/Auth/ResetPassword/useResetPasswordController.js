import { useFormik } from 'formik';
import { useRoute } from '@react-navigation/native';
import * as Yup from 'yup';
import { navigate } from '../../../helpers/navigation';
import { ROUTES } from '../../../helpers/routes';
import { useResetPasswordMutation } from '../../../redux/apis/Auth';

const reset_password_schema = Yup.object({
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters.')
    .required('Password is required.'),
  confirm_password: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match.')
    .required('Please confirm your password.'),
});

const useResetPasswordController = () => {
  const route = useRoute();
  const { email, code } = route.params || {};
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const formik = useFormik({
    initialValues: {
      password: '',
      confirm_password: '',
    },
    validationSchema: reset_password_schema,
    onSubmit: async (values) => {
      const result = await resetPassword({ email, code, password: values.password });

      if (result?.data?.success) {
        navigate(ROUTES.LOGIN);
      }
    },
  });

  return {
    values: {
      formik,
      isLoading,
    },
    functions: {},
  };
};

export default useResetPasswordController;
