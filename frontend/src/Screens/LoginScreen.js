<<<<<<< HEAD
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../Services/api'; 

export default function LoginScreen({ navigation, setUserToken }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor ingresa tu correo y contraseña.');
      return;
    }

    try {
      //  Mandamos las credenciales al backend
      const data = await authService.login(email, password);
      
      // Si es correcto, el servidor nos da el token. ¡Lo guardamos!
      await AsyncStorage.setItem('userToken', data.token);
      
      Alert.alert('¡Bienvenido!', `Qué gusto verte, ${data.user.nombre}`);
      
      // Actualizamos el estado global (Esto nos manda al HomeScreen automáticamente)
      setUserToken(data.token);
    } catch (error) {
      Alert.alert('Acceso denegado', error.message);
=======
import React, { useState } from "react";
import { View, TextInput, StyleSheet, Text, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiFetch } from "../services/api"; 

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
      //  ruta con el backend 
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      await AsyncStorage.setItem('userToken', data.token); // Guardamos el token
      setUserToken(data.token); // Esto automáticamente te manda a MainTabs

    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
>>>>>>> 8ddd17803310174674f5852475bb7a989d88c446
    }
  };

  return (
<<<<<<< HEAD
    <View style={styles.container}>
      <Text style={styles.title}>OfertasYa</Text>

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
=======
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>OfertasYa</Text>
      <Text style={styles.subtitle}>Inicia sesión para continuar</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
>>>>>>> 8ddd17803310174674f5852475bb7a989d88c446
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
<<<<<<< HEAD
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>¿No tienes cuenta? Regístrate aquí</Text>
      </TouchableOpacity>
    </View>
=======
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
        <Text style={styles.registerLink}>¿No tienes cuenta? Regístrate</Text>
      </TouchableOpacity>
    </SafeAreaView>
>>>>>>> 8ddd17803310174674f5852475bb7a989d88c446
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
<<<<<<< HEAD
    justifyContent: 'center', 
    padding: 20, 
    backgroundColor: '#FFF5F5' },
  title: { 
    fontSize: 32, 
    fontWeight: 'bold', 
    color: '#E75480', 
    marginBottom: 40, 
    textAlign: 'center' },
  input: { 
    backgroundColor: '#fff', 
    padding: 15, 
    borderRadius: 10, 
    marginBottom: 15, 
    borderWidth: 1, 
    borderColor: '#FFB6C1' },
  button: { 
    backgroundColor: '#E75480', 
    padding: 15, 
    borderRadius: 10, 
    alignItems: 'center', 
    marginTop: 10 },
  buttonText: { 
    color: '#fff',
    fontWeight: 'bold', 
    fontSize: 16 },
  link: { 
    color: '#E75480', 
    marginTop: 20, 
    textAlign: 'center', 
    fontWeight: 'bold' }
=======
    padding: 20, 
    justifyContent: "center", 
    backgroundColor: "#FFF5F5" },
  title: { 
    fontSize: 32, 
    fontWeight: "bold", 
    textAlign: "center", 
    color: "#E75480", 
    marginBottom: 8 },
  subtitle: { 
    fontSize: 16, 
    textAlign: "center", 
    color: "#FFB6C1", 
    marginBottom: 30 },
  input: { 
    borderWidth: 1, 
    borderColor: "#FFB6C1", 
    padding: 15, 
    borderRadius: 12, 
    marginBottom: 15, 
    backgroundColor: "#FFF", 
    fontSize: 16 },
  loginButton: { 
    backgroundColor: "#E75480", 
    padding: 15, 
    borderRadius: 12, 
    alignItems: "center", 
    marginTop: 10 },
  loginButtonText: { 
    color: "#fff", 
    fontSize: 18, 
    fontWeight: "bold" },
  loader: { 
    marginTop: 20 },
  registerLink: { 
    textAlign: "center", 
    marginTop: 20, 
    color: "#E75480",
    fontWeight: "bold" }
>>>>>>> 8ddd17803310174674f5852475bb7a989d88c446
});