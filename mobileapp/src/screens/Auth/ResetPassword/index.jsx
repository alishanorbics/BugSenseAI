import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import Text from '../../../components/Text';
import images from '../../../assets/images';
import colors from '../../../helpers/colors';
import { heightPixel, widthPixel } from '../../../helpers/metrics';
import useResetPasswordController from './useResetPasswordController';

const ResetPassword = () => {
  const { values } = useResetPasswordController();
  const { formik, isLoading } = values;

  return (
    <View style={styles.container}>
      <Image source={images.logo} resizeMode="contain" style={styles.logo} />

      <Text family="heading" weight="bold" size={26} style={styles.title}>
        Reset Password
      </Text>
      <Text color={colors.muted} style={styles.subtitle}>
        Choose a new password for your account.
      </Text>

      <Input
        label="New Password"
        required
        placeholder="********"
        value={formik.values.password}
        onChangeText={formik.handleChange('password')}
        onBlur={formik.handleBlur('password')}
        error={formik.touched.password ? formik.errors.password : ''}
        secureTextEntry
        style={styles.input}
      />
      <Input
        label="Confirm Password"
        required
        placeholder="********"
        value={formik.values.confirm_password}
        onChangeText={formik.handleChange('confirm_password')}
        onBlur={formik.handleBlur('confirm_password')}
        error={formik.touched.confirm_password ? formik.errors.confirm_password : ''}
        secureTextEntry
        style={styles.input}
      />

      <Button
        label="Reset Password"
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
    justifyContent: 'center',
  },
  logo: {
    width: widthPixel(96),
    height: widthPixel(96),
    alignSelf: 'center',
    marginBottom: heightPixel(24),
  },
  title: {
    marginBottom: heightPixel(6),
  },
  subtitle: {
    marginBottom: heightPixel(32),
  },
  input: {
    marginBottom: heightPixel(16),
  },
  button: {
    marginTop: heightPixel(8),
  },
});

export default ResetPassword;
