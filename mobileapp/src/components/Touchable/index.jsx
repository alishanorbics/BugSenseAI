import React, { memo } from 'react';
import { TouchableOpacity } from 'react-native';

const Touchable = ({
  children,
  onPress = () => {},
  disabled = false,
  activeOpacity = 0.7,
  style,
  ...rest
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={activeOpacity}
      style={style}
      {...rest}
    >
      {children}
    </TouchableOpacity>
  );
};

export default memo(Touchable);
