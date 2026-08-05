import React from 'react';
import { StyleSheet, View } from 'react-native';
import Icon from '../Icon';
import Row from '../Row';
import Text from '../Text';
import Touchable from '../Touchable';
import colors from '../../helpers/colors';
import { formatDate } from '../../helpers/general';
import { heightPixel, widthPixel } from '../../helpers/metrics';

const ProjectCard = ({ project, onPress = () => {} }) => {
  const bug_stats = project.bug_stats || { open: 0, in_progress: 0, closed: 0, total: 0 };
  const { open, in_progress, closed, total } = bug_stats;
  const member_count = project.member_count ?? 0;

  return (
    <Touchable onPress={onPress} style={styles.card}>
      <Text weight="semibold" size={16}>
        {project.name}
      </Text>
      {!!project.description && (
        <Text color={colors.muted} size={13} style={styles.description} numberOfLines={2}>
          {project.description}
        </Text>
      )}

      {total === 0 ? (
        <Text color={colors.muted} size={12} style={styles.no_bugs_text}>
          No bugs reported yet.
        </Text>
      ) : (
        <>
          <Row style={styles.progress_bar}>
            {open > 0 && (
              <View style={[styles.progress_segment, { flex: open, backgroundColor: colors.error }]} />
            )}
            {in_progress > 0 && (
              <View
                style={[styles.progress_segment, { flex: in_progress, backgroundColor: colors.primary }]}
              />
            )}
            {closed > 0 && (
              <View style={[styles.progress_segment, { flex: closed, backgroundColor: colors.muted }]} />
            )}
          </Row>

          <Row style={styles.stats_row} wrap>
            <Row style={styles.stat_chip}>
              <View style={[styles.stat_dot, { backgroundColor: colors.error }]} />
              <Text size={11} color={colors.muted}>
                {open} Open
              </Text>
            </Row>
            <Row style={styles.stat_chip}>
              <View style={[styles.stat_dot, { backgroundColor: colors.primary }]} />
              <Text size={11} color={colors.muted}>
                {in_progress} In Progress
              </Text>
            </Row>
            <Row style={styles.stat_chip}>
              <View style={[styles.stat_dot, { backgroundColor: colors.muted }]} />
              <Text size={11} color={colors.muted}>
                {closed} Closed
              </Text>
            </Row>
          </Row>
        </>
      )}

      <Row justify="space-between" style={styles.footer_row}>
        <Row style={styles.member_chip}>
          <Icon name="users" size={widthPixel(13)} color={colors.muted} />
          <Text size={12} color={colors.muted}>
            {member_count} {member_count === 1 ? 'member' : 'members'}
          </Text>
        </Row>
        <Text size={11} color={colors.muted}>
          Updated {formatDate(project.updatedAt)}
        </Text>
      </Row>
    </Touchable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: colors.muted,
    borderRadius: widthPixel(12),
    padding: widthPixel(16),
    marginBottom: heightPixel(12),
  },
  description: {
    marginTop: heightPixel(4),
  },
  no_bugs_text: {
    marginTop: heightPixel(12),
  },
  progress_bar: {
    height: heightPixel(6),
    borderRadius: widthPixel(3),
    overflow: 'hidden',
    backgroundColor: colors.background,
    marginTop: heightPixel(14),
  },
  progress_segment: {
    height: '100%',
  },
  stats_row: {
    marginTop: heightPixel(10),
    columnGap: widthPixel(14),
    rowGap: heightPixel(6),
  },
  stat_chip: {
    columnGap: widthPixel(6),
  },
  stat_dot: {
    width: widthPixel(7),
    height: widthPixel(7),
    borderRadius: widthPixel(4),
  },
  footer_row: {
    marginTop: heightPixel(14),
  },
  member_chip: {
    columnGap: widthPixel(6),
  },
});

export default ProjectCard;
