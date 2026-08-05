import React from 'react';
import { StyleSheet, View } from 'react-native';
import Icon from '../../components/Icon';
import Loader from '../../components/Loader';
import Text from '../../components/Text';
import Touchable from '../../components/Touchable';
import colors from '../../helpers/colors';
import { heightPixel, widthPixel } from '../../helpers/metrics';
import useDashboardController from './useDashboardController';

const Dashboard = () => {
  const { values, functions } = useDashboardController();
  const { user, role_label, role_metric_label, metrics, isLoading } = values;
  const { goToProjects } = functions;

  return (
    <View style={styles.container}>
      <Text family="heading" weight="bold" size={22} style={styles.title}>
        Dashboard
      </Text>
      <Text color={colors.muted} style={styles.subtitle}>
        Welcome back, {user?.name}.
      </Text>

      {isLoading ? (
        <Loader style={styles.loader} />
      ) : (
        <>
          <Touchable onPress={goToProjects} style={styles.metric_card}>
            <View style={styles.metric_icon_wrap}>
              <Icon name="folder" size={widthPixel(20)} color={colors.background} />
            </View>
            <View style={styles.metric_text}>
              <Text family="heading" weight="bold" size={24}>
                {metrics?.active_projects ?? 0}
              </Text>
              <Text color={colors.muted} size={13}>
                Active Projects
              </Text>
            </View>
            <Icon name="chevron-right" size={widthPixel(18)} color={colors.muted} />
          </Touchable>

          <View style={styles.metric_card}>
            <View style={styles.metric_icon_wrap}>
              <Icon name="bug" size={widthPixel(20)} color={colors.background} />
            </View>
            <View style={styles.metric_text}>
              <Text family="heading" weight="bold" size={24}>
                {metrics?.open_bugs ?? 0}
              </Text>
              <Text color={colors.muted} size={13}>
                Open Bugs
              </Text>
            </View>
          </View>

          <View style={styles.metric_card}>
            <View style={styles.metric_icon_wrap}>
              <Icon name="flag" size={widthPixel(20)} color={colors.background} />
            </View>
            <View style={styles.metric_text}>
              <Text family="heading" weight="bold" size={24}>
                {metrics?.role_metric_count ?? 0}
              </Text>
              <Text color={colors.muted} size={13}>
                {role_metric_label}
              </Text>
            </View>
          </View>

          <Text color={colors.muted} size={12} style={styles.role_note}>
            Showing figures for your {role_label} account.
          </Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: widthPixel(24),
    paddingTop: heightPixel(60),
  },
  title: {
    marginBottom: heightPixel(6),
  },
  subtitle: {
    marginBottom: heightPixel(24),
  },
  loader: {
    flex: 1,
  },
  metric_card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.muted,
    borderRadius: widthPixel(12),
    padding: widthPixel(16),
    marginBottom: heightPixel(12),
  },
  metric_icon_wrap: {
    width: widthPixel(44),
    height: widthPixel(44),
    borderRadius: widthPixel(22),
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: widthPixel(14),
  },
  metric_text: {
    flex: 1,
  },
  role_note: {
    marginTop: heightPixel(4),
  },
});

export default Dashboard;
