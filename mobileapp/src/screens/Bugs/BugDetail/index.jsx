import React from 'react';
import { Linking, ScrollView, StyleSheet, View } from 'react-native';
import Button from '../../../components/Button';
import FlatList from '../../../components/FlatList';
import Icon from '../../../components/Icon';
import Input from '../../../components/Input';
import Loader from '../../../components/Loader';
import Row from '../../../components/Row';
import Text from '../../../components/Text';
import Touchable from '../../../components/Touchable';
import env from '../../../config/env';
import colors from '../../../helpers/colors';
import { BUG_SEVERITY, BUG_STATUS } from '../../../helpers/data';
import { formatTimestamp } from '../../../helpers/general';
import { heightPixel, widthPixel } from '../../../helpers/metrics';
import useBugDetailController from './useBugDetailController';

const SEVERITY_COLORS = {
  [BUG_SEVERITY.LOW]: colors.muted,
  [BUG_SEVERITY.MEDIUM]: colors.secondary,
  [BUG_SEVERITY.HIGH]: colors.primary,
  [BUG_SEVERITY.CRITICAL]: colors.error,
};

const SectionCard = ({ label, children, style }) => (
  <View style={[styles.card, style]}>
    <Text family="heading" weight="bold" size={14} style={styles.card_label}>
      {label}
    </Text>
    {children}
  </View>
);

const AIBlock = ({ icon, label, divider = true, children }) => (
  <View style={divider ? styles.ai_block_divided : styles.ai_block}>
    <Row style={styles.ai_block_label_row}>
      <Icon name={icon} size={widthPixel(13)} color={colors.primary} />
      <Text weight="semibold" size={12} color={colors.primary} style={styles.ai_block_label_text}>
        {label.toUpperCase()}
      </Text>
    </Row>
    {children}
  </View>
);

const BugDetail = () => {
  const { values, functions } = useBugDetailController();
  const {
    bug,
    isLoading,
    can_assign,
    developers,
    selected_developer_id,
    is_assigning,
    is_assignee,
    is_updating_status,
    can_verify_or_reopen,
    can_close,
    is_verifying,
    is_closing,
    is_reopening,
    comments,
    is_comments_loading,
    comment_text,
    is_commenting,
  } = values;
  const {
    setSelectedDeveloperId,
    confirmAssignment,
    startProgress,
    markFixed,
    verifyFix,
    closeThisBug,
    rejectAndReopen,
    setCommentText,
    submitComment,
  } = functions;

  if (isLoading || !bug) {
    return <Loader style={styles.loader} />;
  }

  const severity_color = SEVERITY_COLORS[bug.severity] || colors.muted;
  const has_ai_analysis = !!bug.ai_analysis?.summary;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header_card}>
        <Text family="heading" weight="bold" size={20} style={styles.title}>
          {bug.title}
        </Text>

        <Row style={styles.badge_row}>
          <Row style={styles.badge}>
            <Text size={12} weight="semibold" color={colors.primary}>
              {bug.status.replace('_', ' ').toUpperCase()}
            </Text>
          </Row>
          <Row style={[styles.badge, { borderColor: severity_color }]}>
            <Text size={12} weight="semibold" color={severity_color}>
              {bug.severity.toUpperCase()}
            </Text>
          </Row>
        </Row>

        <Row style={styles.assignee_row}>
          <Icon name="user" size={widthPixel(14)} color={colors.muted} />
          <Text color={colors.muted} size={13} style={styles.assignee_text}>
            {bug.assignee ? `Assigned to ${bug.assignee.name}` : 'Unassigned'}
          </Text>
        </Row>
      </View>

      {can_assign && (
        <View style={styles.card}>
          <Text family="heading" weight="bold" size={14} style={styles.card_label}>
            Assign to Developer
          </Text>
          {developers.length === 0 ? (
            <Text color={colors.muted} size={13}>
              No Developer members in this project yet.
            </Text>
          ) : (
            <>
              <Row style={styles.developer_row} wrap>
                {developers.map((developer) => {
                  const is_selected = developer._id === selected_developer_id;
                  const border_color = is_selected ? colors.primary : colors.muted;
                  const label_color = is_selected ? colors.primary : colors.muted;

                  return (
                    <Touchable
                      key={developer._id}
                      onPress={() => setSelectedDeveloperId(developer._id)}
                      style={[styles.developer_option, { borderColor: border_color }]}
                    >
                      <Text weight="semibold" size={13} color={label_color}>
                        {developer.name}
                      </Text>
                    </Touchable>
                  );
                })}
              </Row>
              <Button
                label="Assign"
                onPress={confirmAssignment}
                loading={is_assigning}
                disabled={!selected_developer_id}
                style={styles.assign_button}
              />
            </>
          )}
        </View>
      )}

      {is_assignee && (bug.status === BUG_STATUS.ASSIGNED || bug.status === BUG_STATUS.REOPENED) && (
        <Button
          label="Start Progress"
          onPress={startProgress}
          loading={is_updating_status}
          style={styles.status_button}
        />
      )}

      {is_assignee && bug.status === BUG_STATUS.IN_PROGRESS && (
        <Button
          label="Mark Fixed"
          onPress={markFixed}
          loading={is_updating_status}
          style={styles.status_button}
        />
      )}

      {can_verify_or_reopen && (
        <Row style={styles.qa_action_row}>
          <Button
            label="Verify Fix"
            onPress={verifyFix}
            loading={is_verifying}
            disabled={is_reopening}
            style={styles.qa_action_button}
          />
          <Button
            label="Reject & Reopen"
            onPress={rejectAndReopen}
            loading={is_reopening}
            disabled={is_verifying}
            color={colors.error}
            style={styles.qa_action_button}
          />
        </Row>
      )}

      {can_close && (
        <Button
          label="Close Bug"
          onPress={closeThisBug}
          loading={is_closing}
          style={styles.status_button}
        />
      )}

      <SectionCard label="Description">
        <Text color={colors.muted} style={styles.card_body_text}>
          {bug.description}
        </Text>
      </SectionCard>

      {!!bug.reproduction_steps && (
        <SectionCard label="Reproduction Steps">
          <Text color={colors.muted} style={styles.card_body_text}>
            {bug.reproduction_steps}
          </Text>
        </SectionCard>
      )}

      <SectionCard label="Attachments">
        <FlatList
          data={bug.attachments}
          empty_text="No attachments."
          scrollEnabled={false}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <Touchable
              onPress={() => Linking.openURL(`${env.FILE_BASE_URL}${item.url}`)}
              style={styles.attachment_row}
            >
              <Icon name="paperclip" size={widthPixel(16)} color={colors.primary} />
              <Text size={13} numberOfLines={1} style={styles.attachment_name}>
                {item.original_name}
              </Text>
            </Touchable>
          )}
        />
      </SectionCard>

      <View style={styles.ai_card}>
        <Row style={styles.ai_header_row}>
          <Icon name="sparkles" size={widthPixel(16)} color={colors.primary} />
          <Text family="heading" weight="bold" size={14} color={colors.primary} style={styles.ai_header_text}>
            AI Analysis
          </Text>
        </Row>

        {!has_ai_analysis ? (
          <Row style={styles.ai_placeholder}>
            <Icon name="alert-circle" size={widthPixel(16)} color={colors.muted} />
            <Text color={colors.muted} size={13} style={styles.ai_placeholder_text}>
              Analysis unavailable.
            </Text>
          </Row>
        ) : (
          <>
            <AIBlock icon="info" label="Summary" divider={false}>
              <Text color={colors.muted} size={13} style={styles.ai_block_text}>
                {bug.ai_analysis.summary}
              </Text>
            </AIBlock>

            {bug.ai_analysis.root_causes?.length > 0 && (
              <AIBlock icon="search" label="Possible Root Causes">
                {bug.ai_analysis.root_causes.map((item, index) => (
                  <Text key={`root-cause-${index}`} color={colors.muted} size={13} style={styles.ai_list_item}>
                    {`• ${item}`}
                  </Text>
                ))}
              </AIBlock>
            )}

            {bug.ai_analysis.affected_modules?.length > 0 && (
              <AIBlock icon="folder" label="Suggested Affected Modules">
                <Row style={styles.module_row} wrap>
                  {bug.ai_analysis.affected_modules.map((module_name, index) => (
                    <Row key={`module-${index}`} style={styles.module_chip}>
                      <Text size={12} weight="semibold" color={colors.primary}>
                        {module_name}
                      </Text>
                    </Row>
                  ))}
                </Row>
              </AIBlock>
            )}

            {bug.ai_analysis.severity_recommendation && (
              <AIBlock icon="alert-triangle" label="Severity Recommendation">
                <Row
                  style={[
                    styles.badge,
                    styles.ai_severity_badge,
                    { borderColor: SEVERITY_COLORS[bug.ai_analysis.severity_recommendation] || colors.muted },
                  ]}
                >
                  <Text
                    size={12}
                    weight="semibold"
                    color={SEVERITY_COLORS[bug.ai_analysis.severity_recommendation] || colors.muted}
                  >
                    {bug.ai_analysis.severity_recommendation.toUpperCase()}
                  </Text>
                </Row>
              </AIBlock>
            )}

            {bug.ai_analysis.debugging_recommendations?.length > 0 && (
              <AIBlock icon="list" label="Debugging Recommendations">
                {bug.ai_analysis.debugging_recommendations.map((item, index) => (
                  <Text key={`debug-rec-${index}`} color={colors.muted} size={13} style={styles.ai_list_item}>
                    {`• ${item}`}
                  </Text>
                ))}
              </AIBlock>
            )}
          </>
        )}
      </View>

      <SectionCard label="Comments">
        <FlatList
          data={comments}
          loading={is_comments_loading}
          empty_text="No comments yet."
          scrollEnabled={false}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.comment_row}>
              <Row justify="space-between">
                <Text weight="semibold" size={13}>
                  {item.author.name}
                </Text>
                <Text size={11} color={colors.muted}>
                  {formatTimestamp(item.createdAt)}
                </Text>
              </Row>
              <Text color={colors.muted} size={13} style={styles.comment_text}>
                {item.text}
              </Text>
            </View>
          )}
        />

        <Row style={styles.comment_input_row}>
          <Input
            placeholder="Add a comment..."
            value={comment_text}
            onChangeText={setCommentText}
            style={styles.comment_input}
          />
          <Touchable
            onPress={submitComment}
            disabled={!comment_text.trim() || is_commenting}
            style={[
              styles.send_button,
              (!comment_text.trim() || is_commenting) && styles.send_button_disabled,
            ]}
          >
            <Icon name="send" size={widthPixel(18)} color={colors.background} />
          </Touchable>
        </Row>
      </SectionCard>
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
  header_card: {
    borderWidth: 1,
    borderColor: colors.muted,
    borderRadius: widthPixel(12),
    padding: widthPixel(16),
    marginBottom: heightPixel(16),
  },
  title: {
    marginBottom: heightPixel(10),
  },
  badge_row: {
    marginBottom: heightPixel(10),
    columnGap: widthPixel(8),
  },
  badge: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: widthPixel(8),
    paddingVertical: heightPixel(4),
    paddingHorizontal: widthPixel(10),
  },
  assignee_row: {
    columnGap: widthPixel(6),
  },
  assignee_text: {
    flex: 1,
  },
  card: {
    borderWidth: 1,
    borderColor: colors.muted,
    borderRadius: widthPixel(12),
    padding: widthPixel(16),
    marginBottom: heightPixel(16),
  },
  card_label: {
    marginBottom: heightPixel(10),
  },
  card_body_text: {
    lineHeight: heightPixel(21),
  },
  developer_row: {
    marginBottom: heightPixel(16),
    columnGap: widthPixel(10),
    rowGap: heightPixel(10),
  },
  developer_option: {
    borderWidth: 1,
    borderRadius: widthPixel(10),
    paddingVertical: heightPixel(10),
    paddingHorizontal: widthPixel(16),
  },
  assign_button: {},
  status_button: {
    marginBottom: heightPixel(16),
  },
  qa_action_row: {
    marginBottom: heightPixel(16),
    columnGap: widthPixel(10),
  },
  qa_action_button: {
    flex: 1,
  },
  attachment_row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.muted,
    borderRadius: widthPixel(10),
    paddingVertical: heightPixel(10),
    paddingHorizontal: widthPixel(12),
    marginBottom: heightPixel(8),
  },
  attachment_name: {
    flex: 1,
    marginLeft: widthPixel(8),
  },
  ai_card: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: widthPixel(12),
    padding: widthPixel(16),
    marginBottom: heightPixel(16),
  },
  ai_header_row: {
    columnGap: widthPixel(8),
    marginBottom: heightPixel(14),
  },
  ai_header_text: {
    flex: 1,
  },
  ai_placeholder: {
    borderWidth: 1,
    borderColor: colors.muted,
    borderRadius: widthPixel(10),
    padding: widthPixel(12),
    columnGap: widthPixel(8),
  },
  ai_placeholder_text: {
    flex: 1,
  },
  ai_block: {
    marginBottom: heightPixel(4),
  },
  ai_block_divided: {
    marginTop: heightPixel(14),
    paddingTop: heightPixel(14),
    borderTopWidth: 1,
    borderTopColor: colors.muted,
  },
  ai_block_label_row: {
    columnGap: widthPixel(6),
    marginBottom: heightPixel(8),
  },
  ai_block_label_text: {
    flex: 1,
    letterSpacing: 0.5,
  },
  ai_block_text: {
    lineHeight: heightPixel(20),
  },
  ai_list_item: {
    marginBottom: heightPixel(6),
    lineHeight: heightPixel(19),
  },
  ai_severity_badge: {
    alignSelf: 'flex-start',
  },
  module_row: {
    columnGap: widthPixel(8),
    rowGap: heightPixel(8),
  },
  module_chip: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: widthPixel(8),
    paddingVertical: heightPixel(4),
    paddingHorizontal: widthPixel(10),
  },
  comment_row: {
    borderWidth: 1,
    borderColor: colors.muted,
    borderRadius: widthPixel(10),
    padding: widthPixel(12),
    marginBottom: heightPixel(8),
  },
  comment_text: {
    marginTop: heightPixel(6),
  },
  comment_input_row: {
    marginTop: heightPixel(4),
    alignItems: 'center',
    columnGap: widthPixel(10),
  },
  comment_input: {
    flex: 1,
    width: undefined,
  },
  send_button: {
    width: widthPixel(44),
    height: widthPixel(44),
    borderRadius: widthPixel(22),
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  send_button_disabled: {
    backgroundColor: colors.muted,
  },
});

export default BugDetail;
