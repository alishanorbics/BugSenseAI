import { useFormik } from 'formik';
import * as Yup from 'yup';
import { goBack } from '../../helpers/navigation';
import { showToast } from '../../helpers/toast';
import { useChangePasswordMutation } from '../../redux/apis/User';

const change_password_schema = Yup.object({
  current_password: Yup.string().required('Current password is required.'),
  new_password: Yup.string()
    .min(8, 'New password must be at least 8 characters.')
    .required('New password is required.'),
  confirm_new_password: Yup.string()
    .oneOf([Yup.ref('new_password')], 'Passwords must match.')
    .required('Please confirm your new password.'),
});

const useChangePasswordController = () => {
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const formik = useFormik({
    initialValues: {
      current_password: '',
      new_password: '',
      confirm_new_password: '',
    },
    validationSchema: change_password_schema,
    onSubmit: async (values) => {
      const result = await changePassword(values);

      if (result?.data?.success) {
        showToast('Password changed successfully.', 'success');
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

export default useChangePasswordController;
