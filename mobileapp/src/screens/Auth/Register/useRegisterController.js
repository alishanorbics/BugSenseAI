import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ROLES } from '../../../helpers/data';
import { navigate } from '../../../helpers/navigation';
import { ROUTES } from '../../../helpers/routes';
import { useRegisterMutation } from '../../../redux/apis/Auth';

const register_schema = Yup.object({
  name: Yup.string().trim().min(2, 'Name must be at least 2 characters.').required('Name is required.'),
  email: Yup.string().trim().email('Enter a valid email address.').required('Email is required.'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters.')
    .required('Password is required.'),
});

const useRegisterController = () => {
  const [role, setRole] = useState(ROLES.QA_ENGINEER);
  const [register, { isLoading }] = useRegisterMutation();

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
    },
    validationSchema: register_schema,
    onSubmit: (values) => {
      register({ ...values, role });
    },
  });

  const goToLogin = () => navigate(ROUTES.LOGIN);

  return {
    values: {
      formik,
      role,
      isLoading,
    },
    functions: {
      setRole,
      goToLogin,
    },
  };
};

export default useRegisterController;
