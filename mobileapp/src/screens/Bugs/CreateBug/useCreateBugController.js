import { useState } from 'react';
import { useFormik } from 'formik';
import { useRoute } from '@react-navigation/native';
import * as Yup from 'yup';
import { launchImageLibrary } from 'react-native-image-picker';
import { BUG_SEVERITY } from '../../../helpers/data';
import { goBack } from '../../../helpers/navigation';
import { useCreateBugMutation } from '../../../redux/apis/Bug';

const create_bug_schema = Yup.object({
  title: Yup.string()
    .trim()
    .min(3, 'Title must be at least 3 characters.')
    .required('Title is required.'),
  description: Yup.string()
    .trim()
    .min(3, 'Description must be at least 3 characters.')
    .required('Description is required.'),
  reproduction_steps: Yup.string().trim(),
});

const useCreateBugController = () => {
  const route = useRoute();
  const { project_id } = route.params || {};
  const [severity, setSeverity] = useState(BUG_SEVERITY.MEDIUM);
  const [attachments, setAttachments] = useState([]);
  const [createBug, { isLoading }] = useCreateBugMutation();

  const pickAttachments = () => {
    launchImageLibrary({ mediaType: 'mixed', selectionLimit: 5 }, (response) => {
      if (response.didCancel || response.errorCode) {
        return;
      }

      setAttachments((prev) => [...prev, ...(response.assets || [])]);
    });
  };

  const removeAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, item_index) => item_index !== index));
  };

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      reproduction_steps: '',
    },
    validationSchema: create_bug_schema,
    onSubmit: async (values) => {
      const form_data = new FormData();
      form_data.append('title', values.title);
      form_data.append('description', values.description);
      form_data.append('reproduction_steps', values.reproduction_steps);
      form_data.append('severity', severity);

      attachments.forEach((attachment, index) => {
        form_data.append('attachments', {
          uri: attachment.uri,
          type: attachment.type || 'image/jpeg',
          name: attachment.fileName || `attachment-${index}.jpg`,
        });
      });

      const result = await createBug({ project_id, formData: form_data });

      if (result?.data?.success) {
        goBack();
      }
    },
  });

  return {
    values: {
      formik,
      severity,
      attachments,
      isLoading,
    },
    functions: {
      setSeverity,
      pickAttachments,
      removeAttachment,
      cancel: goBack,
    },
  };
};

export default useCreateBugController;
