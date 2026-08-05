import React from 'react';
import { Image, ScrollView, StyleSheet } from 'react-native';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import Row from '../../../components/Row';
import Text from '../../../components/Text';
import Touchable from '../../../components/Touchable';
import images from '../../../assets/images';
import colors from '../../../helpers/colors';
import { ROLE_OPTIONS } from '../../../helpers/data';
import { heightPixel, widthPixel } from '../../../helpers/metrics';
import useRegisterController from './useRegisterController';

const Register = () => {
  const { values, functions } = useRegisterController();
  const { formik, role, isLoading } = values;
  const { setRole, goToLogin } = functions;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Image source={images.logo} resizeMode="contain" style={styles.logo} />

      <Text family="heading" weight="bold" size={26} style={styles.title}>
        Create Account
      </Text>
      <Text color={colors.muted} style={styles.subtitle}>
        Join BugSense AI to start tracking bugs.
      </Text>

      <Input
        label="Full name"
        required
        placeholder="e.g. Alice Khan"
        value={formik.values.name}
        onChangeText={formik.handleChange('name')}
        onBlur={formik.handleBlur('name')}
        error={formik.touched.name ? formik.errors.name : ''}
        style={styles.input}
      />
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

      <Text weight="medium" size={13} color={colors.muted} style={styles.role_label}>
        I am a...
      </Text>
      <Row style={styles.role_row}>
        {ROLE_OPTIONS.map((option) => {
          const is_selected = option.value === role;
          const border_color = is_selected ? colors.primary : colors.muted;
          const label_color = is_selected ? colors.primary : colors.muted;

          return (
            <Touchable
              key={option.value}
              onPress={() => setRole(option.value)}
              style={[styles.role_option, { borderColor: border_color }]}
            >
              <Text weight="semibold" color={label_color}>
                {option.label}
              </Text>
            </Touchable>
          );
        })}
      </Row>

      <Button
        label="Register"
        onPress={formik.handleSubmit}
        loading={isLoading}
        style={styles.button}
      />

      <Row justify="center" style={styles.footer}>
        <Text color={colors.muted}>Already have an account? </Text>
        <Touchable onPress={goToLogin}>
          <Text color={colors.primary} weight="semibold">
            Login
          </Text>
        </Touchable>
      </Row>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: widthPixel(24),
    paddingTop: heightPixel(48),
    paddingBottom: heightPixel(40),
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
  role_label: {
    marginBottom: heightPixel(10),
  },
  role_row: {
    marginBottom: heightPixel(8),
    columnGap: widthPixel(12),
  },
  role_option: {
    flex: 1,
    borderWidth: 1,
    borderRadius: widthPixel(12),
    paddingVertical: heightPixel(14),
    alignItems: 'center',
  },
  button: {
    marginTop: heightPixel(16),
  },
  footer: {
    marginTop: heightPixel(24),
  },
});

export default Register;
