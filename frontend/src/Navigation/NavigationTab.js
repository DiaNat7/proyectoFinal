import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../Screens/HomeScreen';
import OfertaFormScreen from '../Screens/OfertaFormScreen';

const Tab = createBottomTabNavigator();

export default function NavigationTab({ setUserToken }) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false, // Ocultamos el título doble de arriba
        tabBarActiveTintColor: '#E75480', // Color rosa para la pestaña activa
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#FFB6C1',
          paddingBottom: 5,
          height: 60,
        }
      }}
    >
      <Tab.Screen name="Inicio">
        {(props) => <HomeScreen {...props} setUserToken={setUserToken} />}
      </Tab.Screen>
      <Tab.Screen name="Nueva Oferta" component={OfertaFormScreen} />
    </Tab.Navigator>
  );
}