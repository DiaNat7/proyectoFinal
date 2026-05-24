import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../Screens/HomeScreen';
import OfertaFormScreen from '../Screens/OfertaFormScreen';
import TiendasScreen from '../Screens/TiendasScreen';
import TiendaFormScreen from '../Screens/TiendaFormScreen';
import FavoritosScreen from '../Screens/FavoritosScreen';

const Tab = createBottomTabNavigator();

export default function NavigationTab({ setUserToken }) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#E75480',
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
      <Tab.Screen name="Inicio" component={HomeScreen} initialParams={{ setUserToken }} />
      <Tab.Screen name="Nueva Oferta" component={OfertaFormScreen} />
      
      <Tab.Screen name="Favoritos" component={FavoritosScreen} />

      <Tab.Screen name="Tiendas" component={TiendasScreen} />
      <Tab.Screen name="Nueva Tienda" component={TiendaFormScreen} />
    </Tab.Navigator>
  );
}