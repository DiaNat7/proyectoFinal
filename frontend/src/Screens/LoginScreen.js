import React, { useState } from "react";
import { View, TextInput, StyleSheet, Text, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from "../Services/api"; 

export default function LoginScreen({ navigation, setUserToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Ingresa email y contraseña");
      return;
    }

    setLoading(true);
    try {
      //  servicio que ya funciona en el backend
      const data = await authService.login(email, password);
      
      await AsyncStorage.setItem('userToken', data.token);
      Alert.alert('¡Bienvenido!', `Qué gusto verte, ${data.user.nombre}`);
      
      setUserToken(data.token); // Esto manda a las pestañas automáticamente
    } catch (error) {
      Alert.alert("Acceso denegado", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Ofertini</Text>
      <Text style={styles.subtitle}>Inicia sesión para continuar</Text>

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {loading ? (
        <ActivityIndicator size="large" color="#E75480" style={styles.loader} />
      ) : (
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.registerLink}>¿No tienes cuenta? Regístrate aquí</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center", backgroundColor: "#FFF5F5" },
  title: { fontSize: 32, fontWeight: "bold", textAlign: "center", color: "#E75480", marginBottom: 8 },
  subtitle: { fontSize: 16, textAlign: "center", color: "#FFB6C1", marginBottom: 30 },
  input: { borderWidth: 1, borderColor: "#FFB6C1", padding: 15, borderRadius: 12, marginBottom: 15, backgroundColor: "#FFF", fontSize: 16 },
  loginButton: { backgroundColor: "#E75480", padding: 15, borderRadius: 12, alignItems: "center", marginTop: 10 },
  loginButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  loader: { marginTop: 20 },
  registerLink: { textAlign: "center", marginTop: 20, color: "#E75480", fontWeight: "bold" }
});