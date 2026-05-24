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
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>OfertasYa</Text>

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
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
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
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
});