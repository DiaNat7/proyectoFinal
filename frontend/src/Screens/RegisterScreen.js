<<<<<<< HEAD
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
=======
import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { apiFetch } from "../services/api";

export default function RegisterScreen({ navigation }) {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // Validaciones básicas antes de enviar al servidor
    if (!nombre || !email || !password) {
      Alert.alert("Error", "Por favor completa todos los campos.");
      return;
    }

    if (password.length < 8) {
      Alert.alert("Error", "La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (!/[A-Z]/.test(password)) {
      Alert.alert("Error", "La contraseña debe tener al menos una mayúscula.");
      return;
    }

    setLoading(true);
    try {
      await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          nombre: nombre,
          email: email.toLowerCase(), // Es buena práctica guardar emails en minúscula
          password: password
        })
      });

      // Si el servidor responde con éxito 
      Alert.alert("¡Éxito!", "Cuenta creada correctamente. ¡Ahora inicia sesión!");
      
      // Limpiamos los campos y regresamos al Login
      setNombre("");
      setEmail("");
      setPassword("");
      navigation.goBack();

    } catch (error) {
      // Si el servidor responde con error
      Alert.alert("Error en el registro", error.message);
    } finally {
      setLoading(false);
>>>>>>> 8ddd17803310174674f5852475bb7a989d88c446
    }
  };

  return (
<<<<<<< HEAD
    <View style={styles.container}>
      <Text style={styles.title}>Crear Cuenta</Text>
=======
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Crear cuenta</Text>
      <Text style={styles.subtitle}>¡Únete a OfertasYa!</Text>
>>>>>>> 8ddd17803310174674f5852475bb7a989d88c446

      <TextInput
        style={styles.input}
        placeholder="Nombre completo"
        value={nombre}
        onChangeText={setNombre}
      />
<<<<<<< HEAD
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
=======
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!mostrarPassword}
        />
        <TouchableOpacity onPress={() => setMostrarPassword(!mostrarPassword)}>
          <Text style={styles.verTexto}>
            {mostrarPassword ? "Ocultar" : "Ver"}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.hint}>
        La contraseña debe tener al menos 8 caracteres y una mayúscula.
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#E75480" style={styles.loader} />
      ) : (
        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.registerButtonText}>Registrarse</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.backLink}>¿Ya tienes cuenta? Inicia sesión</Text>
      </TouchableOpacity>
    </SafeAreaView>
>>>>>>> 8ddd17803310174674f5852475bb7a989d88c446
  );
}

const styles = StyleSheet.create({
<<<<<<< HEAD
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
=======
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#FFF5F5",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    color: "#E75480",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#FFB6C1",
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: "#FFB6C1",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#FFF",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FFB6C1",
    borderRadius: 12,
    marginBottom: 5,
    backgroundColor: "#FFF",
    paddingRight: 10,
  },
  passwordInput: {
    flex: 1,
    padding: 15,
    fontSize: 16,
  },
  verTexto: {
    fontSize: 14,
    color: "#E75480",
    fontWeight: "bold",
    padding: 5,
  },
  hint: {
    fontSize: 12,
    color: "#FFB6C1",
    textAlign: "center",
    marginBottom: 15,
  },
  registerButton: {
    backgroundColor: "#E75480",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  loader: {
    marginTop: 20,
  },
  backLink: {
    textAlign: "center",
    marginTop: 20,
    color: "#E75480",
    fontSize: 15,
    fontWeight: "bold"
  },
>>>>>>> 8ddd17803310174674f5852475bb7a989d88c446
});