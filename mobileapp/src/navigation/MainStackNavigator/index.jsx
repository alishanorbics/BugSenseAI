import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import AppStackNavigator from '../AppStackNavigator';
import AuthStackNavigator from '../AuthStackNavigator';
import { selectIsAuthenticated } from '../../redux/selectors';

const Stack = createStackNavigator();

const MainStackNavigator = () => {
  const is_authenticated = useSelector(selectIsAuthenticated);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {is_authenticated ? (
        <Stack.Screen name="App" component={AppStackNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={AuthStackNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default MainStackNavigator;
