import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ForgotPassword from '../../screens/Auth/ForgotPassword';
import Login from '../../screens/Auth/Login';
import Register from '../../screens/Auth/Register';
import ResetPassword from '../../screens/Auth/ResetPassword';
import VerifyResetCode from '../../screens/Auth/VerifyResetCode';
import { ROUTE_OPTIONS, ROUTES } from '../../helpers/routes';

const Stack = createStackNavigator();

const AuthStackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName={ROUTES.LOGIN} screenOptions={{ headerShown: false }}>
      <Stack.Screen name={ROUTES.LOGIN} component={Login} options={ROUTE_OPTIONS[ROUTES.LOGIN]} />
      <Stack.Screen
        name={ROUTES.REGISTER}
        component={Register}
        options={ROUTE_OPTIONS[ROUTES.REGISTER]}
      />
      <Stack.Screen
        name={ROUTES.FORGOT_PASSWORD}
        component={ForgotPassword}
        options={ROUTE_OPTIONS[ROUTES.FORGOT_PASSWORD]}
      />
      <Stack.Screen
        name={ROUTES.VERIFY_RESET_CODE}
        component={VerifyResetCode}
        options={ROUTE_OPTIONS[ROUTES.VERIFY_RESET_CODE]}
      />
      <Stack.Screen
        name={ROUTES.RESET_PASSWORD}
        component={ResetPassword}
        options={ROUTE_OPTIONS[ROUTES.RESET_PASSWORD]}
      />
    </Stack.Navigator>
  );
};

export default AuthStackNavigator;
