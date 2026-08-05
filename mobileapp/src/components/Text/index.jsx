import React, { memo } from 'react';
import { Text as RNText } from 'react-native';
import fonts from '../../assets/fonts';
import colors from '../../helpers/colors';
import { font } from '../../helpers/metrics';

const Text = ({
  children,
  family = 'body',
  weight = 'regular',
  size = 14,
  color = colors.on_background,
  style,
  ...rest
}) => {
  return (
    <RNText
      style={[
        {
          fontFamily: fonts[family]?.[weight],
          fontSize: font(size),
          color,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </RNText>
  );
};

export default memo(Text);
