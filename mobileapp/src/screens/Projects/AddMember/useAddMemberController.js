import { useState } from 'react';
import { useFormik } from 'formik';
import { useRoute } from '@react-navigation/native';
import * as Yup from 'yup';
import { ROLES } from '../../../helpers/data';
import { goBack } from '../../../helpers/navigation';
import { useAddMemberMutation } from '../../../redux/apis/Project';

const add_member_schema = Yup.object({
  email: Yup.string().trim().email('Enter a valid email address.').required('Email is required.'),
});

const useAddMemberController = () => {
  const route = useRoute();
  const { project_id } = route.params || {};
  const [role, setRole] = useState(ROLES.DEVELOPER);
  const [addMember, { isLoading }] = useAddMemberMutation();

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: add_member_schema,
    onSubmit: async (values) => {
      const result = await addMember({ project_id, email: values.email, role });

      if (result?.data?.success) {
        goBack();
      }
    },
  });

  return {
    values: {
      formik,
      role,
      isLoading,
    },
    functions: {
      setRole,
      cancel: goBack,
    },
  };
};

export default useAddMemberController;
