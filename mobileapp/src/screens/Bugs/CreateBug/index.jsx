import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import Button from '../../../components/Button';
import Icon from '../../../components/Icon';
import Input from '../../../components/Input';
import Row from '../../../components/Row';
import Text from '../../../components/Text';
import Touchable from '../../../components/Touchable';
import colors from '../../../helpers/colors';
import { SEVERITY_OPTIONS } from '../../../helpers/data';
import { heightPixel, widthPixel } from '../../../helpers/metrics';
import useCreateBugController from './useCreateBugController';

const CreateBug = () => {
  const { values, functions } = useCreateBugController();
  const { formik, severity, attachments, isLoading } = values;
  const { setSeverity, pickAttachments, removeAttachment, cancel } = functions;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Touchable onPress={cancel} style={styles.back_button}>
        <Icon name="arrow-left" />
      </Touchable>

      <Text family="heading" weight="bold" size={22} style={styles.title}>
        Report Bug
      </Text>

      <Input
        label="Title"
        required
        placeholder="e.g. Login button unresponsive"
        value={formik.values.title}
        onChangeText={formik.handleChange('title')}
        onBlur={formik.handleBlur('title')}
        error={formik.touched.title ? formik.errors.title : ''}
        style={styles.input}
      />
      <Input
        label="Description"
        required
        placeholder="What went wrong?"
        value={formik.values.description}
        onChangeText={formik.handleChange('description')}
        onBlur={formik.handleBlur('description')}
        error={formik.touched.description ? formik.errors.description : ''}
        multiline
        input_style={styles.multiline_input}
        style={styles.input}
      />
      <Input
        label="Reproduction Steps"
        placeholder={'1. Open app...\n2. Tap...'}
        value={formik.values.reproduction_steps}
        onChangeText={formik.handleChange('reproduction_steps')}
        onBlur={formik.handleBlur('reproduction_steps')}
        multiline
        input_style={styles.multiline_input}
        style={styles.input}
      />

      <Text weight="medium" size={13} color={colors.muted} style={styles.section_label}>
        Severity
      </Text>
      <Row style={styles.severity_row} wrap>
        {SEVERITY_OPTIONS.map((option) => {
          const is_selected = option.value === severity;
          const border_color = is_selected ? colors.primary : colors.muted;
          const label_color = is_selected ? colors.primary : colors.muted;

          return (
            <Touchable
              key={option.value}
              onPress={() => setSeverity(option.value)}
              style={[styles.severity_option, { borderColor: border_color }]}
            >
              <Text weight="semibold" size={13} color={label_color}>
                {option.label}
              </Text>
            </Touchable>
          );
        })}
      </Row>

      <Row justify="space-between" style={styles.section_label}>
        <Text weight="medium" size={13} color={colors.muted}>
          Attachments
        </Text>
        <Touchable onPress={pickAttachments}>
          <Text weight="semibold" size={13} color={colors.primary}>
            + Add
          </Text>
        </Touchable>
      </Row>

      {attachments.map((attachment, index) => (
        <Row key={attachment.uri} justify="space-between" style={styles.attachment_row}>
          <Text size={13} numberOfLines={1} style={styles.attachment_name}>
            {attachment.fileName || `Attachment ${index + 1}`}
          </Text>
          <Touchable onPress={() => removeAttachment(index)}>
            <Icon name="x" size={widthPixel(16)} color={colors.error} />
          </Touchable>
        </Row>
      ))}

      <Button
        label="Submit Report"
        onPress={formik.handleSubmit}
        loading={isLoading}
        style={styles.button}
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
  back_button: {
    marginBottom: heightPixel(20),
    width: widthPixel(36),
    height: widthPixel(36),
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginBottom: heightPixel(24),
  },
  input: {
    marginBottom: heightPixel(16),
  },
  multiline_input: {
    height: heightPixel(100),
    paddingTop: heightPixel(12),
    textAlignVertical: 'top',
  },
  section_label: {
    marginBottom: heightPixel(10),
  },
  severity_row: {
    marginBottom: heightPixel(24),
    columnGap: widthPixel(10),
    rowGap: heightPixel(10),
  },
  severity_option: {
    borderWidth: 1,
    borderRadius: widthPixel(10),
    paddingVertical: heightPixel(10),
    paddingHorizontal: widthPixel(16),
  },
  attachment_row: {
    borderWidth: 1,
    borderColor: colors.muted,
    borderRadius: widthPixel(10),
    paddingVertical: heightPixel(10),
    paddingHorizontal: widthPixel(12),
    marginBottom: heightPixel(8),
  },
  attachment_name: {
    flex: 1,
    marginRight: widthPixel(8),
  },
  button: {
    marginTop: heightPixel(16),
  },
});

export default CreateBug;
