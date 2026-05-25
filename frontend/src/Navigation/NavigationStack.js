import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "../Screens/LoginScreen";
import RegisterScreen from "../Screens/RegisterScreen";
import NavigationTab from "./NavigationTab"; 
import OfertaDetailScreen from "../Screens/OfertaDetailScreen"; 
import OfertaEditScreen from "../Screens/OfertaEditScreen"; 
import CategoriesDetailScreen from "../Screens/CategoriesDetailScreen";
import TiendaDetailScreen from "../Screens/TiendaDetailScreen";
import TiendasEditScreen from "../Screens/TiendasEditScreen"; 

const Stack = createNativeStackNavigator();

export default function NavigationStack({ userToken, setUserToken }) {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {userToken ? (
          <Stack.Group>
            <Stack.Screen name="MainTabs">
              {(props) => <NavigationTab {...props} setUserToken={setUserToken} />}
            </Stack.Screen>
            
            {/* Rutas de Ofertas */}
            <Stack.Screen name="Detalle" component={OfertaDetailScreen} />
            <Stack.Screen name="Editar" component={OfertaEditScreen} />

            {/* Rutas de Tiendas */}
            <Stack.Screen name="TiendaDetalle" component={TiendaDetailScreen} />
            <Stack.Screen name="TiendaEditar" component={TiendasEditScreen} />
            <Stack.Screen name="CategoriaDetalle" component={CategoriesDetailScreen} />
          </Stack.Group>
        ) : (
          <Stack.Group>
            <Stack.Screen name="Login">
              {(props) => <LoginScreen {...props} setUserToken={setUserToken} />}
            </Stack.Screen>
            <Stack.Screen name="Register">
              {(props) => <RegisterScreen {...props} setUserToken={setUserToken} />}
            </Stack.Screen>
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}