<<<<<<< HEAD
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
=======
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../Screens/LoginScreen";
import RegisterScreen from "../Screens/RegisterScreen";

const Stack = createNativeStackNavigator();

export default function NavigationStack({ setUserToken }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Primera pantalla en mostrarse */}
      <Stack.Screen name="Login">
        {(props) => <LoginScreen {...props} setUserToken={setUserToken} />}
      </Stack.Screen>
      
      {/* Pantalla de registro */}
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
>>>>>>> 8ddd17803310174674f5852475bb7a989d88c446
  );
}