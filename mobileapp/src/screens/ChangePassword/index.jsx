import React from 'react';
import { StyleSheet, View } from 'react-native';
import Button from '../../components/Button';
import Icon from '../../components/Icon';
import Input from '../../components/Input';
import Text from '../../components/Text';
import Touchable from '../../components/Touchable';
import colors from '../../helpers/colors';
import { heightPixel, widthPixel } from '../../helpers/metrics';
import useChangePasswordController from './useChangePasswordController';

const ChangePassword = () => {
  const { values, functions } = useChangePasswordController();
  const { formik, isLoading } = values;
  const { cancel } = functions;

  return (
    <View style={styles.container}>
      <Touchable onPress={cancel} style={styles.back_button}>
        <Icon name="arrow-left" />
      </Touchable>

      <Text family="heading" weight="bold" size={22} style={styles.title}>
        Change Password
      </Text>
      <Text color={colors.muted} style={styles.subtitle}>
        Enter your current password and choose a new one.
      </Text>

      <Input
        label="Current Password"
        required
        placeholder="********"
        value={formik.values.current_password}
        onChangeText={formik.handleChange('current_password')}
        onBlur={formik.handleBlur('current_password')}
        error={formik.touched.current_password ? formik.errors.current_password : ''}
        secureTextEntry
        style={styles.input}
      />
      <Input
        label="New Password"
        required
        placeholder="********"
        value={formik.values.new_password}
        onChangeText={formik.handleChange('new_password')}
        onBlur={formik.handleBlur('new_password')}
        error={formik.touched.new_password ? formik.errors.new_password : ''}
        secureTextEntry
        style={styles.input}
      />
      <Input
        label="Confirm New Password"
        required
        placeholder="********"
        value={formik.values.confirm_new_password}
        onChangeText={formik.handleChange('confirm_new_password')}
        onBlur={formik.handleBlur('confirm_new_password')}
        error={formik.touched.confirm_new_password ? formik.errors.confirm_new_password : ''}
        secureTextEntry
        style={styles.input}
      />

      <Button
        label="Change Password"
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
    marginBottom: heightPixel(6),
  },
  subtitle: {
    marginBottom: heightPixel(24),
  },
  input: {
    marginBottom: heightPixel(16),
  },
  button: {
    marginTop: heightPixel(8),
  },
});

export default ChangePassword;
