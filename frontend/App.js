import React, { useState, useEffect } from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import NavigationStack from "./src/Navigation/NavigationStack"; 
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
    <NavigationStack userToken={userToken} setUserToken={setUserToken} />
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: '#FFF5F5' }
});