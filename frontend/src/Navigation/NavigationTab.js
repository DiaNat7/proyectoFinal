import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HomeScreen from '../Screens/HomeScreen';
import CategoriesScreen from '../Screens/CategoriesScreen';
import TiendasScreen from '../Screens/TiendasScreen';
import FavoritosScreen from '../Screens/FavoritosScreen';

const Tab = createBottomTabNavigator();

export default function NavigationTab({ setUserToken }) {
  // Estado para guardar el rol recuperado de la memoria
  const [userRole, setUserRole] = useState(null);

  // useEffect se ejecuta automáticamente al cargar las pestañas
  useEffect(() => {
    const fetchRole = async () => {
      try {
        const role = await AsyncStorage.getItem('userRole');
        setUserRole(role);
      } catch (error) {
        console.error("Error obteniendo el rol del usuario:", error);
      }
    };
    fetchRole();
  }, []);

  // Mientras se lee el rol de la memoria, devolvemos una vista vacía 
  // para evitar que la pestaña "parpadee" en la pantalla de un admin.
  if (userRole === null) {
    return <View style={{ flex: 1, backgroundColor: '#FFF5F5' }} />;
  }

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
      
      {/* Esta pestaña solo se muestra si el rol NO es admin */}
      {userRole !== 'admin' && (
        <Tab.Screen 
          name="Favoritos" 
          component={FavoritosScreen} 
          options={{ 
            tabBarLabel: "Ofertas Favoritas",
            tabBarIcon: () => <Text style={{ fontSize: 24 }}>❤️</Text> 
          }} 
        />
      )}
      
    </Tab.Navigator>
  );
}