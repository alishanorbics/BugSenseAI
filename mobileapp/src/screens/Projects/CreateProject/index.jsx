import React from 'react';
import { StyleSheet, View } from 'react-native';
import Button from '../../../components/Button';
import Icon from '../../../components/Icon';
import Input from '../../../components/Input';
import Touchable from '../../../components/Touchable';
import Text from '../../../components/Text';
import colors from '../../../helpers/colors';
import { heightPixel, widthPixel } from '../../../helpers/metrics';
import useCreateProjectController from './useCreateProjectController';

const CreateProject = () => {
  const { values, functions } = useCreateProjectController();
  const { formik, isLoading } = values;
  const { cancel } = functions;

  return (
    <View style={styles.container}>
      <Touchable onPress={cancel} style={styles.back_button}>
        <Icon name="arrow-left" />
      </Touchable>

      <Text family="heading" weight="bold" size={22} style={styles.title}>
        New Project
      </Text>

      <Input
        label="Project Name"
        required
        placeholder="e.g. BugSense Mobile App"
        value={formik.values.name}
        onChangeText={formik.handleChange('name')}
        onBlur={formik.handleBlur('name')}
        error={formik.touched.name ? formik.errors.name : ''}
        style={styles.input}
      />
      <Input
        label="Description"
        placeholder="What is this project about?"
        value={formik.values.description}
        onChangeText={formik.handleChange('description')}
        onBlur={formik.handleBlur('description')}
        error={formik.touched.description ? formik.errors.description : ''}
        multiline
        input_style={styles.description_input}
        style={styles.input}
      />

      <Button
        label="Create Project"
        onPress={formik.handleSubmit}
        loading={isLoading}
        style={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: widthPixel(24),
    paddingTop: heightPixel(60),
  },
  back_button: {
    marginBottom: heightPixel(20),
    width: widthPixel(36),
    height: widthPixel(36),
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginBottom: heightPixel(24),
  },
  input: {
    marginBottom: heightPixel(16),
  },
  description_input: {
    height: heightPixel(100),
    paddingTop: heightPixel(12),
    textAlignVertical: 'top',
  },
  button: {
    marginTop: heightPixel(8),
  },
});

export default CreateProject;
