import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AddMember from '../../screens/Projects/AddMember';
import CreateProject from '../../screens/Projects/CreateProject';
import ProjectDetail from '../../screens/Projects/ProjectDetail';
import BugDetail from '../../screens/Bugs/BugDetail';
import CreateBug from '../../screens/Bugs/CreateBug';
import ChangePassword from '../../screens/ChangePassword';
import AppTabNavigator from '../AppTabNavigator';
import { ROUTE_OPTIONS, ROUTES } from '../../helpers/routes';

const Stack = createStackNavigator();

const AppStackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName={ROUTES.APP_TABS} screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name={ROUTES.APP_TABS}
        component={AppTabNavigator}
        options={ROUTE_OPTIONS[ROUTES.APP_TABS]}
      />
      <Stack.Screen
        name={ROUTES.CREATE_PROJECT}
        component={CreateProject}
        options={ROUTE_OPTIONS[ROUTES.CREATE_PROJECT]}
      />
      <Stack.Screen
        name={ROUTES.PROJECT_DETAIL}
        component={ProjectDetail}
        options={ROUTE_OPTIONS[ROUTES.PROJECT_DETAIL]}
      />
      <Stack.Screen
        name={ROUTES.ADD_MEMBER}
        component={AddMember}
        options={ROUTE_OPTIONS[ROUTES.ADD_MEMBER]}
      />
      <Stack.Screen
        name={ROUTES.CREATE_BUG}
        component={CreateBug}
        options={ROUTE_OPTIONS[ROUTES.CREATE_BUG]}
      />
      <Stack.Screen
        name={ROUTES.BUG_DETAIL}
        component={BugDetail}
        options={ROUTE_OPTIONS[ROUTES.BUG_DETAIL]}
      />
      <Stack.Screen
        name={ROUTES.CHANGE_PASSWORD}
        component={ChangePassword}
        options={ROUTE_OPTIONS[ROUTES.CHANGE_PASSWORD]}
      />
    </Stack.Navigator>
  );
};

export default AppStackNavigator;
