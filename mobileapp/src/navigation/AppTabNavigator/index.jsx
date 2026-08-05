import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from '../../components/Icon';
import Text from '../../components/Text';
import Dashboard from '../../screens/Dashboard';
import Profile from '../../screens/Profile';
import ProjectList from '../../screens/Projects/ProjectList';
import colors from '../../helpers/colors';
import { ROUTES } from '../../helpers/routes';
import { heightPixel, widthPixel } from '../../helpers/metrics';

const Tab = createBottomTabNavigator();

const TAB_ICONS = {
  [ROUTES.DASHBOARD]: 'dashboard',
  [ROUTES.PROJECT_LIST]: 'folder',
  [ROUTES.PROFILE]: 'user',
};

const TAB_LABELS = {
  [ROUTES.DASHBOARD]: 'Dashboard',
  [ROUTES.PROJECT_LIST]: 'Projects',
  [ROUTES.PROFILE]: 'Profile',
};

const AppTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tab_bar,
        tabBarIcon: ({ color, size }) => <Icon name={TAB_ICONS[route.name]} color={color} size={size} />,
        tabBarLabel: ({ color, focused }) => (
          <Text color={color} size={11} weight={focused ? 'semibold' : 'regular'}>
            {TAB_LABELS[route.name]}
          </Text>
        ),
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
      })}
    >
      <Tab.Screen name={ROUTES.DASHBOARD} component={Dashboard} />
      <Tab.Screen name={ROUTES.PROJECT_LIST} component={ProjectList} />
      <Tab.Screen name={ROUTES.PROFILE} component={Profile} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tab_bar: {
    backgroundColor: colors.background,
    borderTopColor: colors.muted,
    borderTopWidth: StyleSheet.hairlineWidth,
    height: heightPixel(88),
    paddingTop: heightPixel(8),
    paddingHorizontal: widthPixel(8),
  },
});

export default AppTabNavigator;
