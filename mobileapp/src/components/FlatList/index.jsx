import React from 'react';
import { FlatList as RNFlatList, StyleSheet, View } from 'react-native';
import Loader from '../Loader';
import Text from '../Text';
import colors from '../../helpers/colors';
import { heightPixel } from '../../helpers/metrics';

const FlatList = ({
  data = [],
  loading = false,
  empty_text = 'Nothing to show.',
  contentContainerStyle,
  ...rest
}) => {
  if (loading) {
    return <Loader style={styles.state} />;
  }

  if (!data.length) {
    return (
      <View style={styles.state}>
        <Text color={colors.muted}>{empty_text}</Text>
      </View>
    );
  }

  return (
    <RNFlatList
      data={data}
      contentContainerStyle={[styles.content, contentContainerStyle]}
      {...rest}
    />
  );
};

const styles = StyleSheet.create({
  state: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: heightPixel(40),
  },
  content: {
    flexGrow: 1,
  },
});

export default FlatList;
