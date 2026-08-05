import React from 'react';
import { StyleSheet, View } from 'react-native';
import Button from '../../../components/Button';
import Icon from '../../../components/Icon';
import Input from '../../../components/Input';
import Row from '../../../components/Row';
import Text from '../../../components/Text';
import Touchable from '../../../components/Touchable';
import colors from '../../../helpers/colors';
import { ROLE_OPTIONS } from '../../../helpers/data';
import { heightPixel, widthPixel } from '../../../helpers/metrics';
import useAddMemberController from './useAddMemberController';

const AddMember = () => {
  const { values, functions } = useAddMemberController();
  const { formik, role, isLoading } = values;
  const { setRole, cancel } = functions;

  return (
    <View style={styles.container}>
      <Touchable onPress={cancel} style={styles.back_button}>
        <Icon name="arrow-left" />
      </Touchable>

      <Text family="heading" weight="bold" size={22} style={styles.title}>
        Add Member
      </Text>

      <Input
        label="Email"
        required
        placeholder="member@example.com"
        value={formik.values.email}
        onChangeText={formik.handleChange('email')}
        onBlur={formik.handleBlur('email')}
        error={formik.touched.email ? formik.errors.email : ''}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />

      <Text weight="medium" size={13} color={colors.muted} style={styles.role_label}>
        Role
      </Text>
      <Row style={styles.role_row}>
        {ROLE_OPTIONS.map((option) => {
          const is_selected = option.value === role;
          const border_color = is_selected ? colors.primary : colors.muted;
          const label_color = is_selected ? colors.primary : colors.muted;

          return (
            <Touchable
              key={option.value}
              onPress={() => setRole(option.value)}
              style={[styles.role_option, { borderColor: border_color }]}
            >
              <Text weight="semibold" color={label_color}>
                {option.label}
              </Text>
            </Touchable>
          );
        })}
      </Row>

      <Button
        label="Add Member"
        onPress={formik.handleSubmit}
        loading={isLoading}
        style={styles.button}
      />
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
  role_label: {
    marginBottom: heightPixel(10),
  },
  role_row: {
    marginBottom: heightPixel(24),
    columnGap: widthPixel(12),
  },
  role_option: {
    flex: 1,
    borderWidth: 1,
    borderRadius: widthPixel(12),
    paddingVertical: heightPixel(14),
    alignItems: 'center',
  },
  button: {
    marginTop: heightPixel(8),
  },
});

export default AddMember;
