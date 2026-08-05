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
import useVerifyResetCodeController from './useVerifyResetCodeController';

const VerifyResetCode = () => {
  const { values, functions } = useVerifyResetCodeController();
  const { formik, isLoading, email } = values;
  const { goToLogin } = functions;

  return (
    <View style={styles.container}>
      <Image source={images.logo} resizeMode="contain" style={styles.logo} />

      <Text family="heading" weight="bold" size={26} style={styles.title}>
        Verify Code
      </Text>
      <Text color={colors.muted} style={styles.subtitle}>
        Enter the 6-digit code sent to {email}.
      </Text>

      <Input
        label="Reset Code"
        required
        placeholder="123456"
        value={formik.values.code}
        onChangeText={formik.handleChange('code')}
        onBlur={formik.handleBlur('code')}
        error={formik.touched.code ? formik.errors.code : ''}
        keyboardType="number-pad"
        maxLength={6}
        style={styles.input}
      />

      <Button
        label="Verify Code"
        onPress={formik.handleSubmit}
        loading={isLoading}
        style={styles.button}
      />

      <Row justify="center" style={styles.footer}>
        <Touchable onPress={goToLogin}>
          <Text color={colors.primary} weight="semibold">
            Back to Login
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
  button: {
    marginTop: heightPixel(8),
  },
  footer: {
    marginTop: heightPixel(24),
  },
});

export default VerifyResetCode;
