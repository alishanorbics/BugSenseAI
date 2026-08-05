import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { Animated, StyleSheet } from 'react-native';
import Text from '../Text';
import colors from '../../helpers/colors';
import { heightPixel, widthPixel } from '../../helpers/metrics';

const AUTO_HIDE_DELAY = 2500;
const ANIMATION_DURATION = 200;

const Toast = forwardRef((props, ref) => {
  const [message, setMessage] = useState('');
  const [type, setType] = useState('error');
  const opacity = useRef(new Animated.Value(0)).current;
  const hide_timeout = useRef(null);

  const hide = () => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: ANIMATION_DURATION,
      useNativeDriver: true,
    }).start(() => setMessage(''));
  };

  useImperativeHandle(ref, () => ({
    show: (next_message, next_type = 'error') => {
      clearTimeout(hide_timeout.current);
      setMessage(next_message);
      setType(next_type);

      Animated.timing(opacity, {
        toValue: 1,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }).start();

      hide_timeout.current = setTimeout(hide, AUTO_HIDE_DELAY);
    },
    hide,
  }));

  if (!message) {
    return null;
  }

  const background_color = type === 'error' ? colors.secondary : colors.primary;

  return (
    <Animated.View
      style={[styles.container, { opacity, backgroundColor: background_color }]}
      pointerEvents="none"
    >
      <Text color={colors.background} weight="medium" size={13}>
        {message}
      </Text>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: heightPixel(50),
    left: widthPixel(20),
    right: widthPixel(20),
    borderRadius: widthPixel(12),
    paddingVertical: heightPixel(14),
    paddingHorizontal: widthPixel(16),
    alignItems: 'center',
  },
});

export default Toast;
