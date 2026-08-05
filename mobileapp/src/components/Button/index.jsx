import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import Loader from '../Loader';
import Text from '../Text';
import Touchable from '../Touchable';
import colors from '../../helpers/colors';
import { heightPixel, widthPixel } from '../../helpers/metrics';

const Button = ({
  label = '',
  onPress = () => {},
  loading = false,
  disabled = false,
  color = colors.primary,
  text_color = colors.background,
  style,
  ...rest
}) => {
  return (
    <Touchable
      onPress={onPress}
      disabled={disabled || loading}
      style={[styles.button, { backgroundColor: color }, style]}
      {...rest}
    >
      {loading ? (
        <Loader size="small" color={text_color} />
      ) : (
        <Text color={text_color} weight="semibold" size={16}>
          {label}
        </Text>
      )}
    </Touchable>
  );
};

const styles = StyleSheet.create({
  button: {
    height: heightPixel(52),
    borderRadius: widthPixel(12),
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: widthPixel(16),
  },
});

export default memo(Button);
