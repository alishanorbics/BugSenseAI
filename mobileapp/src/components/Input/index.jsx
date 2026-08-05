import React, { memo } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import Text from '../Text';
import fonts from '../../assets/fonts';
import colors from '../../helpers/colors';
import { font, heightPixel, widthPixel } from '../../helpers/metrics';

const Input = ({
  label = '',
  required = false,
  error = '',
  value,
  onChangeText = () => {},
  placeholder = '',
  secureTextEntry = false,
  style,
  input_style,
  ...rest
}) => {
  return (
    <View style={[styles.container, style]}>
      {!!label && (
        <Text size={13} weight="medium" color={colors.muted} style={styles.label}>
          {label}
          {required && (
            <Text size={13} weight="medium" color={colors.error}>
              {' *'}
            </Text>
          )}
        </Text>
      )}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        secureTextEntry={secureTextEntry}
        style={[styles.input, !!error && styles.input_error, input_style]}
        {...rest}
      />
      {!!error && (
        <Text size={12} color={colors.error} style={styles.error}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    marginBottom: heightPixel(6),
  },
  input: {
    height: heightPixel(52),
    borderRadius: widthPixel(12),
    borderWidth: 1,
    borderColor: colors.muted,
    paddingHorizontal: widthPixel(16),
    color: colors.on_background,
    fontFamily: fonts.body.regular,
    fontSize: font(14),
  },
  input_error: {
    borderColor: colors.error,
  },
  error: {
    marginTop: heightPixel(4),
  },
});

export default memo(Input);
