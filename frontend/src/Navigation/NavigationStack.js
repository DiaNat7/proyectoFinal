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
  );
}