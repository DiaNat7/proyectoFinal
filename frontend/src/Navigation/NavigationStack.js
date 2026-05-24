import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import LoginScreen from '../Screens/LoginScreen';
import RegisterScreen from '../Screens/RegisterScreen';
import HomeScreen from '../Screens/HomeScreen';

const Stack = createNativeStackNavigator();

export default function NavigationStack({ userToken, setUserToken }) {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {userToken ? (
          <Stack.Screen name="Home">
            {(props) => <HomeScreen {...props} setUserToken={setUserToken} />}
          </Stack.Screen>
        ) : (
          <>
            <Stack.Screen name="Login">
              {(props) => <LoginScreen {...props} setUserToken={setUserToken} />}
            </Stack.Screen>
            
            <Stack.Screen name="Register">
              {(props) => <RegisterScreen {...props} setUserToken={setUserToken} />}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}