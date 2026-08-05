import React, { memo } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import colors from '../../helpers/colors';

const Loader = ({ size = 'large', color = colors.primary, style, ...rest }) => {
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={color} {...rest} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default memo(Loader);
