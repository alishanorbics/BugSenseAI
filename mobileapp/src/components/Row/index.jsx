import React from 'react';
import { StyleSheet, View } from 'react-native';

const Row = ({
  children,
  align = 'center',
  justify = 'flex-start',
  wrap = false,
  style,
  ...rest
}) => {
  const flex_wrap = wrap ? 'wrap' : 'nowrap';

  return (
    <View
      style={[
        styles.row,
        { alignItems: align, justifyContent: justify, flexWrap: flex_wrap },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
});

export default Row;
