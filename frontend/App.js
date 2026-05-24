import React, { useState, useEffect } from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";
<<<<<<< HEAD
// Asegúrate de que esta ruta coincida con tus carpetas:
import NavigationStack from "./src/Navigation/NavigationStack"; 
=======
import { NavigationContainer } from "@react-navigation/native";
import NavigationStack from "./src/Navigation/NavigationStack";
>>>>>>> 8ddd17803310174674f5852475bb7a989d88c446
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [userToken, setUserToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) setUserToken(token);
      } catch (e) {
        console.log("Error leyendo token", e);
      }
      setIsLoading(false);
    };
    checkToken();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#E75480" />
      </View>
    );
  }

  return (
<<<<<<< HEAD
    <NavigationStack userToken={userToken} setUserToken={setUserToken} />
=======
    <NavigationContainer>
      <NavigationStack userToken={userToken} setUserToken={setUserToken} />
    </NavigationContainer>
>>>>>>> 8ddd17803310174674f5852475bb7a989d88c446
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: '#FFF5F5' }
});