import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from '../Screens/HomeScreen';
import CategoriesScreen from '../Screens/CategoriesScreen';
import TiendasScreen from '../Screens/TiendasScreen';
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
          paddingBottom: 40, 
          height: 100,       
          elevation: 40,
        }
      }}
    >
      <Tab.Screen 
        name="Inicio" 
        component={HomeScreen} 
        initialParams={{ setUserToken }} 
        options={{
          tabBarIcon: () => <Text style={{ fontSize: 24 }}>🏠</Text>
        }}
      />
      
      <Tab.Screen 
        name="Categorías" 
        component={CategoriesScreen} 
        options={{
          tabBarIcon: () => <Text style={{ fontSize: 24 }}>🛍️</Text> 
        }}
      />
      
      <Tab.Screen 
        name="Tiendas" 
        component={TiendasScreen} 
        options={{
          tabBarIcon: () => <Text style={{ fontSize: 24 }}>🏪</Text> 
        }}
      />
      
      <Tab.Screen 
        name="Favoritos" 
        component={FavoritosScreen} 
        options={{ 
          tabBarLabel: "Ofertas Favoritas",
          tabBarIcon: () => <Text style={{ fontSize: 24 }}>❤️</Text> 
        }} 
      />
    </Tab.Navigator>
  );
}