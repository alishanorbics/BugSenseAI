import React from 'react';
import { StyleSheet, View } from 'react-native';
import Button from '../../components/Button';
import Icon from '../../components/Icon';
import Row from '../../components/Row';
import Text from '../../components/Text';
import Touchable from '../../components/Touchable';
import colors from '../../helpers/colors';
import { heightPixel, widthPixel } from '../../helpers/metrics';
import useProfileController from './useProfileController';

const Profile = () => {
  const { values, functions } = useProfileController();
  const { user, role_label } = values;
  const { handleLogout, goToChangePassword } = functions;

  return (
    <View style={styles.container}>
      <Text family="heading" weight="bold" size={22} style={styles.title}>
        Profile
      </Text>

      <Row style={styles.avatar_row}>
        <Row style={styles.avatar}>
          <Icon name="user" size={widthPixel(28)} color={colors.background} />
        </Row>
        <View style={styles.avatar_text}>
          <Text weight="semibold" size={17}>
            {user?.name}
          </Text>
          <Text color={colors.muted} size={13}>
            {user?.email}
          </Text>
        </View>
      </Row>

      <Row justify="space-between" style={styles.info_row}>
        <Text color={colors.muted} size={13}>
          Role
        </Text>
        <Text weight="semibold" size={13} color={colors.primary}>
          {role_label}
        </Text>
      </Row>

      <Touchable onPress={goToChangePassword} style={styles.menu_row}>
        <Row style={styles.menu_row_left}>
          <Icon name="lock" size={widthPixel(16)} color={colors.muted} />
          <Text weight="medium" size={14} style={styles.menu_row_label}>
            Change Password
          </Text>
        </Row>
        <Icon name="chevron-right" size={widthPixel(16)} color={colors.muted} />
      </Touchable>

      <Button label="Log Out" onPress={handleLogout} color={colors.error} style={styles.logout_button} />
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
    marginBottom: heightPixel(28),
  },
  avatar_row: {
    marginBottom: heightPixel(20),
    columnGap: widthPixel(14),
  },
  avatar: {
    width: widthPixel(56),
    height: widthPixel(56),
    borderRadius: widthPixel(28),
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar_text: {
    flex: 1,
  },
  info_row: {
    borderWidth: 1,
    borderColor: colors.muted,
    borderRadius: widthPixel(10),
    paddingVertical: heightPixel(12),
    paddingHorizontal: widthPixel(14),
    marginBottom: heightPixel(32),
  },
  menu_row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.muted,
    borderRadius: widthPixel(10),
    paddingVertical: heightPixel(12),
    paddingHorizontal: widthPixel(14),
  },
  menu_row_left: {
    columnGap: widthPixel(8),
  },
  menu_row_label: {
    flex: 1,
  },
  logout_button: {
    marginTop: heightPixel(8),
  },
});

export default Profile;
