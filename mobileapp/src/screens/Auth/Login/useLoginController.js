import { useFormik } from 'formik';
import * as Yup from 'yup';
import { navigate } from '../../../helpers/navigation';
import { ROUTES } from '../../../helpers/routes';
import { useLoginMutation } from '../../../redux/apis/Auth';

const login_schema = Yup.object({
  email: Yup.string().trim().email('Enter a valid email address.').required('Email is required.'),
  password: Yup.string().required('Password is required.'),
});

const useLoginController = () => {
  const [login, { isLoading }] = useLoginMutation();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: login_schema,
    onSubmit: (values) => {
      login(values);
    },
  });

  const goToRegister = () => navigate(ROUTES.REGISTER);
  const goToForgotPassword = () => navigate(ROUTES.FORGOT_PASSWORD);

  return {
    values: {
      formik,
      isLoading,
    },
    functions: {
      goToRegister,
      goToForgotPassword,
    },
  };
};

export default useLoginController;
