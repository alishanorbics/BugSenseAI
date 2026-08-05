import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import Row from '../../../components/Row';
import Text from '../../../components/Text';
import Touchable from '../../../components/Touchable';
import images from '../../../assets/images';
import colors from '../../../helpers/colors';
import { heightPixel, widthPixel } from '../../../helpers/metrics';
import useLoginController from './useLoginController';

const Login = () => {
  const { values, functions } = useLoginController();
  const { formik, isLoading } = values;
  const { goToRegister, goToForgotPassword } = functions;

  return (
    <View style={styles.container}>
      <Image source={images.logo} resizeMode="contain" style={styles.logo} />

      <Text family="heading" weight="bold" size={26} style={styles.title}>
        Welcome Back
      </Text>
      <Text color={colors.muted} style={styles.subtitle}>
        Log in to continue tracking bugs.
      </Text>

      <Input
        label="Email"
        required
        placeholder="you@example.com"
        value={formik.values.email}
        onChangeText={formik.handleChange('email')}
        onBlur={formik.handleBlur('email')}
        error={formik.touched.email ? formik.errors.email : ''}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />
      <Input
        label="Password"
        required
        placeholder="********"
        value={formik.values.password}
        onChangeText={formik.handleChange('password')}
        onBlur={formik.handleBlur('password')}
        error={formik.touched.password ? formik.errors.password : ''}
        secureTextEntry
        style={styles.input}
      />

      <Row justify="flex-end" style={styles.forgot_row}>
        <Touchable onPress={goToForgotPassword}>
          <Text color={colors.primary} weight="medium" size={13}>
            Forgot password?
          </Text>
        </Touchable>
      </Row>

      <Button label="Login" onPress={formik.handleSubmit} loading={isLoading} style={styles.button} />

      <Row justify="center" style={styles.footer}>
        <Text color={colors.muted}>Don&apos;t have an account? </Text>
        <Touchable onPress={goToRegister}>
          <Text color={colors.primary} weight="semibold">
            Register
          </Text>
        </Touchable>
      </Row>
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
  forgot_row: {
    marginBottom: heightPixel(8),
  },
  button: {
    marginTop: heightPixel(8),
  },
  footer: {
    marginTop: heightPixel(24),
  },
});

export default Login;
