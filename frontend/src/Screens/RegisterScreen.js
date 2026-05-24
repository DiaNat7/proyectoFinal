import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { authService } from '../Services/api'; 

export default function RegisterScreen({ navigation }) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    // Validamos que no deje campos vacíos
    if (!nombre || !email || !password) {
      Alert.alert('Error', 'Por favor llena todos los campos.');
      return;
    }

    try {
      // Le gritamos al servidor para que guarde el usuario
      await authService.register(nombre, email, password);
      
      Alert.alert('¡Éxito!', 'Tu cuenta ha sido creada.');
      
      // Lo mandamos de regreso al Login para que entre
      navigation.navigate('Login');
    } catch (error) {
      // Si ya tiene registro, lo mostramos
      Alert.alert('Error al registrar', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Cuenta</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre completo"
        value={nombre}
        onChangeText={setNombre}
      />
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

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Registrarme</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>¿Ya tienes cuenta? Inicia sesión aquí</Text>
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
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#E75480', 
    marginBottom: 30, 
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