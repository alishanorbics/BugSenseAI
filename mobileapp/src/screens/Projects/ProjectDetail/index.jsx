import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import FlatList from '../../../components/FlatList';
import Icon from '../../../components/Icon';
import Loader from '../../../components/Loader';
import Row from '../../../components/Row';
import Text from '../../../components/Text';
import Touchable from '../../../components/Touchable';
import colors from '../../../helpers/colors';
import { ROLES } from '../../../helpers/data';
import { heightPixel, widthPixel } from '../../../helpers/metrics';
import useProjectDetailController from './useProjectDetailController';

const BUG_STAT_ITEMS = [
  { key: 'open', label: 'Open', color: colors.error },
  { key: 'in_progress', label: 'In Progress', color: colors.primary },
  { key: 'fixed', label: 'Fixed', color: colors.secondary },
  { key: 'verified', label: 'Verified', color: colors.on_background },
  { key: 'closed', label: 'Closed', color: colors.muted },
];

const ProjectDetail = () => {
  const { values, functions } = useProjectDetailController();
  const { project, isLoading, bugs, isBugsLoading, can_manage_members, can_report_bug } = values;
  const { goToAddMember, goToCreateBug, goToBugDetail } = functions;

  if (isLoading || !project) {
    return <Loader style={styles.loader} />;
  }

  const bug_stats = project.bug_stats || { open: 0, in_progress: 0, fixed: 0, verified: 0, closed: 0, total: 0 };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text family="heading" weight="bold" size={22} style={styles.title}>
        {project.name}
      </Text>
      {!!project.description && (
        <Text color={colors.muted} style={styles.description}>
          {project.description}
        </Text>
      )}
      <Row style={styles.created_by_row}>
        <Icon name="user" size={widthPixel(14)} color={colors.muted} />
        <Text color={colors.muted} size={13} style={styles.created_by_text}>
          Created by {project.created_by?.name}
        </Text>
      </Row>

      <Text family="heading" weight="bold" size={15} style={styles.section_label}>
        Bug Overview
      </Text>
      <View style={styles.overview_card}>
        {bug_stats.total === 0 ? (
          <Text color={colors.muted} size={13}>
            No bugs reported yet.
          </Text>
        ) : (
          <Row style={styles.stats_row} wrap>
            {BUG_STAT_ITEMS.map((item) => (
              <Row key={item.key} style={styles.stat_chip}>
                <View style={[styles.stat_dot, { backgroundColor: item.color }]} />
                <Text size={12} color={colors.muted}>
                  {bug_stats[item.key]} {item.label}
                </Text>
              </Row>
            ))}
          </Row>
        )}
      </View>

      <Row justify="space-between" style={styles.section_header}>
        <Text family="heading" weight="bold" size={16}>
          Members ({project.members.length})
        </Text>
        {can_manage_members && (
          <Touchable onPress={goToAddMember} style={styles.section_action}>
            <Icon name="plus" size={widthPixel(16)} color={colors.background} />
          </Touchable>
        )}
      </Row>

      <FlatList
        data={project.members}
        empty_text="No members added yet."
        scrollEnabled={false}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <Row justify="space-between" style={styles.member_row}>
            <View>
              <Text weight="medium">{item.name}</Text>
              <Text color={colors.muted} size={12}>
                {item.email}
              </Text>
            </View>
            <Row style={[styles.role_badge, { borderColor: colors.primary }]}>
              <Text color={colors.primary} size={11} weight="semibold">
                {item.role === ROLES.DEVELOPER ? 'Developer' : 'QA Engineer'}
              </Text>
            </Row>
          </Row>
        )}
      />

      <Row justify="space-between" style={styles.section_header}>
        <Text family="heading" weight="bold" size={16}>
          Bugs ({bug_stats.total})
        </Text>
        {can_report_bug && (
          <Touchable onPress={goToCreateBug} style={styles.section_action}>
            <Icon name="plus" size={widthPixel(16)} color={colors.background} />
          </Touchable>
        )}
      </Row>

      <FlatList
        data={bugs}
        loading={isBugsLoading}
        empty_text="No bugs reported yet."
        scrollEnabled={false}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <Touchable onPress={() => goToBugDetail(item._id)} style={styles.bug_row}>
            <Row justify="space-between">
              <Text weight="medium" style={styles.bug_title} numberOfLines={1}>
                {item.title}
              </Text>
              <Row style={[styles.mini_badge, { borderColor: colors.error }]}>
                <Text size={10} weight="semibold" color={colors.error}>
                  {item.severity.toUpperCase()}
                </Text>
              </Row>
            </Row>
            <Row justify="space-between" style={styles.bug_row_bottom}>
              <Row style={[styles.mini_badge, { borderColor: colors.primary }]}>
                <Text size={10} weight="semibold" color={colors.primary}>
                  {item.status.replace('_', ' ').toUpperCase()}
                </Text>
              </Row>
              <Text size={12} color={colors.muted}>
                {item.assignee ? item.assignee.name : 'Unassigned'}
              </Text>
            </Row>
          </Touchable>
        )}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: widthPixel(24),
    paddingTop: heightPixel(60),
    paddingBottom: heightPixel(40),
  },
  loader: {
    flex: 1,
    backgroundColor: colors.background,
  },
  title: {
    marginBottom: heightPixel(6),
  },
  description: {
    marginBottom: heightPixel(10),
  },
  created_by_row: {
    columnGap: widthPixel(6),
  },
  created_by_text: {
    flex: 1,
  },
  section_label: {
    marginTop: heightPixel(24),
    marginBottom: heightPixel(10),
  },
  overview_card: {
    borderWidth: 1,
    borderColor: colors.muted,
    borderRadius: widthPixel(12),
    padding: widthPixel(16),
  },
  stats_row: {
    columnGap: widthPixel(14),
    rowGap: heightPixel(10),
  },
  stat_chip: {
    columnGap: widthPixel(6),
  },
  stat_dot: {
    width: widthPixel(7),
    height: widthPixel(7),
    borderRadius: widthPixel(4),
  },
  section_header: {
    marginTop: heightPixel(24),
    marginBottom: heightPixel(12),
  },
  section_action: {
    width: widthPixel(28),
    height: widthPixel(28),
    borderRadius: widthPixel(14),
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  member_row: {
    borderWidth: 1,
    borderColor: colors.muted,
    borderRadius: widthPixel(12),
    padding: widthPixel(12),
    marginBottom: heightPixel(8),
  },
  role_badge: {
    borderWidth: 1,
    borderRadius: widthPixel(6),
    paddingVertical: heightPixel(3),
    paddingHorizontal: widthPixel(8),
  },
  bug_row: {
    borderWidth: 1,
    borderColor: colors.muted,
    borderRadius: widthPixel(12),
    padding: widthPixel(12),
    marginBottom: heightPixel(8),
  },
  bug_title: {
    flex: 1,
    marginRight: widthPixel(8),
  },
  bug_row_bottom: {
    marginTop: heightPixel(8),
  },
  mini_badge: {
    borderWidth: 1,
    borderRadius: widthPixel(6),
    paddingVertical: heightPixel(2),
    paddingHorizontal: widthPixel(8),
  },
});

export default ProjectDetail;
